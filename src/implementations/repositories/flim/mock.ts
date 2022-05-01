import { FilmModel } from "src/declarations/models/film";
import { FilmRepository } from "src/declarations/repositories/film";

export class MockFilmRepository implements FilmRepository {
  countByUserId = jest.fn<Promise<number>, [string]>();

  findEalistByUserId = jest.fn<Promise<FilmModel[]>, [string, number]>();

  save = jest.fn<Promise<FilmModel>, [string]>();

  delete = jest.fn<Promise<void>, [string]>();
}
