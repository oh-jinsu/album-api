import { PhotoModel } from "../models/photo";

export type SavePhotoDto = {
  userId: string;
  albumId: string;
  imageUri: string;
  description: string;
};

export type UpdatePhotoDto = {
  description: string;
};

export abstract class PhotoRepository {
  abstract countByAlbumId(albumId: string): Promise<number>;

  abstract findByAlbumId(albumId: string): Promise<PhotoModel[]>;

  abstract save(dto: SavePhotoDto): Promise<PhotoModel>;

  abstract update(id: string, dto: UpdatePhotoDto): Promise<PhotoModel>;

  abstract delete(id: string): Promise<void>;
}
