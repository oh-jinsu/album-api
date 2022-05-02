import { Option } from "src/core/enums/option";
import { AlbumModel } from "../models/album";

export type SaveAlbumDto = {
  title: string;
};

export type UpdateAlbumDto = Partial<
  Omit<AlbumModel, "id" | "updatedAt" | "createdAt">
>;

export abstract class AlbumRepository {
  abstract findOne(id: string): Promise<Option<AlbumModel>>;

  abstract save(dto: SaveAlbumDto): Promise<AlbumModel>;

  abstract update(id: string, dto: UpdateAlbumDto): Promise<AlbumModel>;

  abstract delete(id: string): Promise<void>;
}
