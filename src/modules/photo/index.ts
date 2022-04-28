import { Module } from "@nestjs/common";
import { CreatePhotoModule } from "./create/module";
import { FindPhotosModule } from "./find/module";

@Module({
  imports: [FindPhotosModule, CreatePhotoModule],
})
export class PhotoModule {}
