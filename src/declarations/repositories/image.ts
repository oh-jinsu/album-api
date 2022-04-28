import { Option } from "src/core/enums/option";
import { ImageModel } from "../models/image";

export type SaveImageDto = {
  userId: string;
  buffer: Buffer;
  mimetype: string;
};

export abstract class ImageRepository {
  abstract getPublicImageUri(id: string): Promise<Option<string>>;

  abstract save(dto: SaveImageDto): Promise<ImageModel>;

  abstract delete(id: string): Promise<void>;
}
