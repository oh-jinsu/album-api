import { Option } from "src/core/types/option";
import { ImageModel } from "../models/image";

export type SaveImageDto = {
  userId: string;
  buffer: Buffer;
  mimetype: string;
};

export abstract class ImageRepository {
  abstract findOne(id: string): Promise<Option<ImageModel>>;

  abstract save(dto: SaveImageDto): Promise<ImageModel>;

  abstract delete(id: string): Promise<void>;
}
