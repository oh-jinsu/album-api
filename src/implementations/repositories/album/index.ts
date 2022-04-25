import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { AlbumModel } from "src/declarations/models/album";
import {
  AlbumRepository,
  SaveAlbumDto,
  UpdateAlbumDto,
} from "src/declarations/repositories/album";
import { LessThan, Repository } from "typeorm";
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
    limit: number,
    cursor?: string,
  ): Promise<{ next?: string; items: AlbumModel[] }> {
    const date = cursor
      ? (await this.adaptee.findOne(cursor)).createdAt
      : new Date();

    const query = await this.adaptee.find({
      where: {
        userId,
        createdAt: LessThan(date),
      },
      order: {
        createdAt: "DESC",
      },
      take: limit + 1,
    });

    const last = query.length == limit + 1 && query.pop();

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
