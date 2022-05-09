import { config, S3 } from "aws-sdk";
import { isProduction } from "src/core/environment";

config.update({
  region: "ap-northeast-2",
});

const s3 = new S3({
  apiVersion: "2006-03-01",
});

const getPublicUrl = (
  key: string,
  option?: {
    expiration?: number;
  },
) =>
  s3.getSignedUrlPromise("getObject", {
    Bucket: isProduction
      ? process.env.AWS_S3_BUCKET_NAME
      : process.env.AWS_S3_BUCKET_NAME_FOR_DEV,
    Key: key,
    Expires: option?.expiration || Number(process.env.AWS_S3_OBJECT_EXPIRATION),
  });

const upload = (key: string, buffer: Buffer, mimetype: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    s3.upload(
      {
        Bucket: isProduction
          ? process.env.AWS_S3_BUCKET_NAME
          : process.env.AWS_S3_BUCKET_NAME_FOR_DEV,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      },
    );
  });

const remove = (key: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: isProduction
          ? process.env.AWS_S3_BUCKET_NAME
          : process.env.AWS_S3_BUCKET_NAME_FOR_DEV,
        Key: key,
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      },
    );
  });

export default {
  upload,
  remove,
  getPublicUrl,
};
