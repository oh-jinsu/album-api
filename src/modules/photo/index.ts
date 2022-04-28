import { Module } from "@nestjs/common";
import { CreatePhotoModule } from "./create/module";
import { DeletePhotoModule } from "./delete/module";
import { FindPhotosModule } from "./find/module";

@Module({
  imports: [FindPhotosModule, CreatePhotoModule, DeletePhotoModule],
})
export class PhotoModule {}
