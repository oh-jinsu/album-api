import { Option } from "src/core/types/option";
import { PhotoModel } from "../models/photo";

export type SavePhotoDto = {
  userId: string;
  albumId: string;
  image: string;
  date: Date;
  description: string;
};

export type UpdatePhotoDto = {
  date?: Date;
  description?: string;
};

export abstract class PhotoRepository {
  abstract countByAlbumId(albumId: string): Promise<number>;

  abstract findByAlbumId(
    albumId: string,
    limit?: number,
    cursor?: string,
  ): Promise<{ next?: string; items: PhotoModel[] }>;

  abstract findLatestByAlbumId(albumId: string): Promise<Option<PhotoModel>>;

  abstract findOne(id: string): Promise<Option<PhotoModel>>;

  abstract save(dto: SavePhotoDto): Promise<PhotoModel>;

  abstract update(id: string, dto: UpdatePhotoDto): Promise<PhotoModel>;

  abstract delete(id: string): Promise<void>;
}
