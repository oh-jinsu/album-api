import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/core/enums/option";
import { ImageModel } from "src/declarations/models/image";
import {
  ImageRepository,
  SaveImageDto,
} from "src/declarations/repositories/image";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import s3 from "../../storage/s3";
import { ImageEntity } from "./entity";
import { ImageMapper } from "./mapper";
import * as sharp from "sharp";
import { isProduction } from "src/core/environment";

@Injectable()
export class ImageRepositoryImpl implements ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly adaptee: Repository<ImageEntity>,
  ) {}
  async save({ userId, buffer, mimetype }: SaveImageDto): Promise<ImageModel> {
    const id = v4();

    const newone = this.adaptee.create({ id, userId });

    const [mdpi, xhdpi, xxhdpi] = await Promise.all([
      sharp(buffer).resize(375).withMetadata().toBuffer(),
      sharp(buffer).resize(768).withMetadata().toBuffer(),
      sharp(buffer).resize(1024).withMetadata().toBuffer(),
    ]);

    const [entity] = await Promise.all([
      this.adaptee.save(newone),
      s3.upload(`${id}/mdpi`, mdpi, mimetype),
      s3.upload(`${id}/xhdpi`, xhdpi, mimetype),
      s3.upload(`${id}/xxhdpi`, xxhdpi, mimetype),
    ]);

    s3.upload(`${id}/origin`, buffer, mimetype);

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

    const host = isProduction
      ? process.env.AWS_CLOUDFRONT_HOST
      : process.env.AWS_CLOUDFRONT_HOST_FOR_DEV;

    return new Some(`${host}/${id}/xxhdpi`);
  }
}
