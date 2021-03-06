import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/core/types/option";
import { AlbumModel } from "src/declarations/models/album";
import {
  AlbumRepository,
  SaveAlbumDto,
  UpdateAlbumDto,
} from "src/declarations/repositories/album";
import { Repository } from "typeorm";
import { AlbumEntity } from "./entity";
import { AlbumMapper } from "./mapper";
import { v4 } from "uuid";

@Injectable()
export class AlbumRepositoryImpl implements AlbumRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly adaptee: Repository<AlbumEntity>,
  ) {}

  async findOne(id: string): Promise<Option<AlbumModel>> {
    const entity = await this.adaptee.findOne(id);

    if (!entity) {
      return new None();
    }

    return new Some(AlbumMapper.toModel(entity));
  }

  async save({ title }: SaveAlbumDto): Promise<AlbumModel> {
    const newone = this.adaptee.create({
      id: v4(),
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
