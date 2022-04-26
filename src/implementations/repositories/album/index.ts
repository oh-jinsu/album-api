import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { AlbumModel } from "src/declarations/models/album";
import {
  AlbumRepository,
  SaveAlbumDto,
  UpdateAlbumDto,
} from "src/declarations/repositories/album";
import { LessThanOrEqual, Repository } from "typeorm";
import { AlbumEntity } from "./entity";
import { AlbumMapper } from "./mapper";

@Injectable()
export class AlbumRepositoryImpl implements AlbumRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly adaptee: Repository<AlbumEntity>,
  ) {}

  async findByUserId(
    userId: string,
    limit?: number,
    cursor?: string,
  ): Promise<{ next?: string; items: AlbumModel[] }> {
    let date = new Date();

    if (cursor) {
      const entity = await this.adaptee.findOne(cursor);

      if (entity) {
        date = entity.createdAt;
      }
    }

    const query = await this.adaptee.find({
      where: {
        userId,
        createdAt: LessThanOrEqual(date),
      },
      order: {
        createdAt: "DESC",
      },
      skip: 0,
      take: limit ? limit + 1 : null,
    });

    const last = Number(query.length) === limit + 1 ? query.pop() : null;

    return { next: last?.id, items: query.map(AlbumMapper.toModel) };
  }

  async save({ userId, title }: SaveAlbumDto): Promise<AlbumModel> {
    const newone = this.adaptee.create({
      id: randomUUID(),
      userId,
      title,
    });

    const entity = await this.adaptee.save(newone);

    return AlbumMapper.toModel(entity);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<AlbumModel> {
    await this.adaptee.update(id, dto);

    const entity = await this.adaptee.findOne(id);

    return AlbumMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
