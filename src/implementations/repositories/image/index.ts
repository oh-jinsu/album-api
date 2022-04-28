import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { None, Option, Some } from "src/core/enums/option";
import { ImageModel } from "src/declarations/models/image";
import {
  ImageRepository,
  SaveImageDto,
} from "src/declarations/repositories/image";
import { Repository } from "typeorm";
import s3 from "../../storage/s3";
import { ImageEntity } from "./entity";
import { ImageMapper } from "./mapper";

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly adaptee: Repository<ImageEntity>,
  ) {}
  async save({ userId, buffer, mimetype }: SaveImageDto): Promise<ImageModel> {
    const id = randomUUID();

    const newone = this.adaptee.create({ id, userId });

    const [entity] = await Promise.all([
      this.adaptee.save(newone),
      s3.upload(id, buffer, mimetype),
    ]);

    return ImageMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await Promise.all([this.adaptee.delete(id), s3.remove(id)]);
  }

  async getPublicImageUri(id: string): Promise<Option<string>> {
    const entity = await this.adaptee.findOne(id);

    if (!entity) {
      return new None();
    }

    const result = await s3.getPublicUrl(id);

    return new Some(result);
  }
}
