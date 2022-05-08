import { PhotoModel } from "src/declarations/models/photo";
import { PhotoEntity } from "./entity";

export class PhotoMapper {
  static toModel({
    id,
    userId,
    albumId,
    image,
    date,
    description,
    updatedAt,
    createdAt,
  }: PhotoEntity): PhotoModel {
    return new PhotoModel({
      id,
      userId,
      albumId,
      image,
      date,
      description,
      updatedAt,
      createdAt,
    });
  }
}
