import { Option } from "src/core/types/option";
import { ImageModel } from "src/declarations/models/image";
import {
  ImageRepository,
  SaveImageDto,
} from "src/declarations/repositories/image";

export class MockImageRepository implements ImageRepository {
  findOne = jest.fn<Promise<Option<ImageModel>>, [string]>();

  save = jest.fn<Promise<ImageModel>, [SaveImageDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
