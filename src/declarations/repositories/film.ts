import { FilmModel } from "../models/film";

export abstract class FilmRepository {
  abstract countByUserId(userId: string): Promise<number>;

  abstract findEalistByUserId(
    userId: string,
    take: number,
  ): Promise<FilmModel[]>;

  abstract save(userId: string): Promise<FilmModel>;

  abstract delete(id: string): Promise<void>;
}
