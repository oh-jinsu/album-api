export abstract class ImageProvider {
  abstract getPublicImageUri(id: string): Promise<string>;
}
