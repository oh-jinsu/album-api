export abstract class ImageProvider {
  abstract put(
    filename: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<void>;

  abstract get(filename: string): Promise<string>;
}
