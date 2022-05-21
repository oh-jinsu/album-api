import { Module } from "@nestjs/common";
import { HealthModule } from "./health/module";
import { UploadImageModule } from "./upload_image/module";

@Module({
  imports: [HealthModule, UploadImageModule],
})
export class UtilModule {}
