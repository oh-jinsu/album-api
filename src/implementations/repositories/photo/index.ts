import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoModel } from "src/declarations/models/photo";
import {
  PhotoRepository,
  SavePhotoDto,
  UpdatePhotoDto,
} from "src/declarations/repositories/photo";
import { Repository } from "typeorm";
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

  async findByAlbumId(albumId: string): Promise<PhotoModel[]> {
    const entities = await this.adaptee.find({ albumId });

    return entities.map(PhotoMapper.toModel);
  }

  async save(dto: SavePhotoDto): Promise<PhotoModel> {
    const newone = this.adaptee.create(dto);

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