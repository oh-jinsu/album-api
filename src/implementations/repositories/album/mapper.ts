import { AlbumModel } from "src/declarations/models/album";
import { AlbumEntity } from "./entity";

export class AlbumMapper {
  static toModel({ id, title, updatedAt, createdAt }: AlbumEntity): AlbumModel {
    return new AlbumModel({
      id,
      title,
      updatedAt,
      createdAt,
    });
  }
}
