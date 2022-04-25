import { AlbumModel } from "../models/album";

export type SaveAlbumDto = {
  title: string;
  userId: string;
};

export type UpdateAlbumDto = Partial<
  Omit<AlbumModel, "id" | "updatedAt" | "createdAt">
>;

export abstract class AlbumRepository {
  abstract findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ next?: string; items: AlbumModel[] }>;

  abstract save(dto: SaveAlbumDto): Promise<AlbumModel>;

  abstract update(id: string, dto: UpdateAlbumDto): Promise<AlbumModel>;

  abstract delete(id: string): Promise<void>;
}
