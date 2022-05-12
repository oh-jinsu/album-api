import { isProduction } from "src/core/environment";
import { ImageProvider } from "src/declarations/providers/image";

export class ImageProviderImpl implements ImageProvider {
  async getPublicImageUri(id: string): Promise<string> {
    const host = isProduction
      ? process.env.AWS_CLOUDFRONT_HOST
      : process.env.AWS_CLOUDFRONT_HOST_FOR_DEV;

    return `${host}/${id}`;
  }
}
