import { config, S3 } from "aws-sdk";

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
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: option?.expiration || 60,
  });

const upload = (key: string, buffer: Buffer, mimetype: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
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

export default {
  upload,
  getPublicUrl,
};
