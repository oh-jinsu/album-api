import { ImageProvider } from "src/declarations/providers/image";

export class MockImageProvider extends ImageProvider {
  getPublicImageUri = jest.fn<Promise<string>, [string]>();
}
