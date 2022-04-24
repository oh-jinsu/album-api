import { ImageProvider } from "src/declarations/providers/image";

export class MockImageProvider implements ImageProvider {
  put = jest.fn<Promise<void>, [string, Buffer, string]>();

  get = jest.fn<Promise<string>, [string]>();
}
