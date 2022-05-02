import { Option } from "src/core/enums/option";
import { AlbumModel } from "src/declarations/models/album";
import {
  AlbumRepository,
  SaveAlbumDto,
  UpdateAlbumDto,
} from "src/declarations/repositories/album";

export class MockAlbumRepository implements AlbumRepository {
  findOne = jest.fn<Promise<Option<AlbumModel>>, [string]>();

  save = jest.fn<Promise<AlbumModel>, [SaveAlbumDto]>();

  update = jest.fn<Promise<AlbumModel>, [string, UpdateAlbumDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
