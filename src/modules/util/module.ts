import { Module } from "@nestjs/common";
import { UploadImageModule } from "./upload_image/module";

@Module({
  imports: [UploadImageModule],
})
export class UtilModule {}
