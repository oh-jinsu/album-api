import { PhotoModel } from "src/declarations/models/photo";
import {
  PhotoRepository,
  SavePhotoDto,
  UpdatePhotoDto,
} from "src/declarations/repositories/photo";

export class MockPhotoRepository implements PhotoRepository {
  countByAlbumId = jest.fn<Promise<number>, [string]>();

  findByAlbumId = jest.fn<Promise<PhotoModel[]>, [string]>();

  save = jest.fn<Promise<PhotoModel>, [SavePhotoDto]>();

  update = jest.fn<Promise<PhotoModel>, [string, UpdatePhotoDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
