import { config, S3 } from "aws-sdk";

config.update({
  region: "ap-northeast-2",
});

export const s3 = new S3({
  apiVersion: "2006-03-01",
});
