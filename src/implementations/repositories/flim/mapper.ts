import { FilmModel } from "src/declarations/models/film";
import { FilmEntity } from "./entity";

export class FilmMapper {
  static toModel({ id, userId, createdAt }: FilmEntity): FilmModel {
    return new FilmModel({
      id,
      userId,
      createdAt,
    });
  }
}
