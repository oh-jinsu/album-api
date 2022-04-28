import { Option } from "src/core/enums/option";
import { ImageModel } from "src/declarations/models/image";
import {
  ImageRepository,
  SaveImageDto,
} from "src/declarations/repositories/image";

export class MockImageRepository implements ImageRepository {
  save = jest.fn<Promise<ImageModel>, [SaveImageDto]>();

  delete = jest.fn<Promise<void>, [string]>();

  getPublicImageUri = jest.fn<Promise<Option<string>>, [string]>();
}
