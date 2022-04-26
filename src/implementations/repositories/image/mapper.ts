import { ImageModel } from "src/declarations/models/image";
import { ImageEntity } from "./entity";

export class ImageMapper {
  static toModel({ id, userId, createdAt }: ImageEntity): ImageModel {
    return new ImageModel({
      id,
      userId,
      createdAt,
    });
  }
}
