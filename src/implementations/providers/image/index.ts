import { ImageProvider } from "src/declarations/providers/image";
import { s3 } from "../storage/s3";

export class ImageProviderImpl implements ImageProvider {
  async put(filename: string, buffer: Buffer, mimetype: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      s3.upload(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: filename,
          Body: buffer,
          ContentType: mimetype,
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            console.log(data);
            resolve(null);
          }
        },
      );
    });
  }

  async get(filename: string): Promise<string> {
    return s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Expires: 60,
    });
  }
}
