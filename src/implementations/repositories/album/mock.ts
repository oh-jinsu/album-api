import { AlbumModel } from "src/declarations/models/album";
import {
  AlbumRepository,
  SaveAlbumDto,
  UpdateAlbumDto,
} from "src/declarations/repositories/album";

export class MockAlbumRepository implements AlbumRepository {
  findByUserId = jest.fn<
    Promise<{ next?: string; items: AlbumModel[] }>,
    [string, number, string]
  >();

  save = jest.fn<Promise<AlbumModel>, [SaveAlbumDto]>();

  update = jest.fn<Promise<AlbumModel>, [string, UpdateAlbumDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
