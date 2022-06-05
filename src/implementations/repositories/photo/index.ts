import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/core/types/option";
import { PhotoModel } from "src/declarations/models/photo";
import {
  PhotoRepository,
  SavePhotoDto,
  UpdatePhotoDto,
} from "src/declarations/repositories/photo";
import { LessThan, Repository } from "typeorm";
import { v4 } from "uuid";
import { PhotoEntity } from "./entity";
import { PhotoMapper } from "./mapper";

@Injectable()
export class PhotoRepositoryImpl implements PhotoRepository {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly adaptee: Repository<PhotoEntity>,
  ) {}

  async countByAlbumId(albumId: string): Promise<number> {
    return this.adaptee.count({ albumId });
  }

  async findByAlbumId(
    albumId: string,
    limit?: number,
    cursor?: string,
  ): Promise<{ next?: string; items: PhotoModel[] }> {
    const cursored = await this.adaptee.findOne({
      id: cursor,
    });

    const take = limit ? limit + (cursored ? 0 : 1) : null;

    const query = await this.adaptee.find({
      where: [
        {
          albumId,
          date: LessThan(cursored?.date || new Date()),
        },
        {
          albumId,
          date: cursored?.date || new Date(),
          createdAt: cursored ? LessThan(cursored.createdAt) : null,
        },
      ],
      order: {
        date: "DESC",
        createdAt: "DESC",
      },
      take,
    });

    if (cursored) {
      query.unshift(cursored);
    }

    const next = limit && query.length === limit + 1 ? query.pop() : null;

    return { next: next?.id, items: query.map(PhotoMapper.toModel) };
  }

  async findLatestByAlbumId(albumId: string): Promise<Option<PhotoModel>> {
    const entities = await this.adaptee.find({
      where: {
        albumId,
      },
      order: {
        createdAt: "DESC",
      },
      take: 1,
    });

    if (entities.length === 0) {
      return new None();
    }

    return new Some(PhotoMapper.toModel(entities[0]));
  }

  async findOne(id: string): Promise<Option<PhotoModel>> {
    const entity = await this.adaptee.findOne(id);

    if (!entity) {
      return new None();
    }

    return new Some(PhotoMapper.toModel(entity));
  }

  async save({
    userId,
    albumId,
    image,
    date,
    description,
  }: SavePhotoDto): Promise<PhotoModel> {
    const newone = this.adaptee.create({
      id: v4(),
      userId,
      albumId,
      image,
      date,
      description,
    });

    const entity = await this.adaptee.save(newone);

    return PhotoMapper.toModel(entity);
  }

  async update(id: string, dto: UpdatePhotoDto): Promise<PhotoModel> {
    await this.adaptee.update(id, dto);

    const entity = await this.adaptee.findOne(id);

    return PhotoMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
