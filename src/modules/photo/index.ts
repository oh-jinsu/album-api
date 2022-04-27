import { Module } from "@nestjs/common";
import { CreatePhotoModule } from "./create/module";

@Module({
  imports: [CreatePhotoModule],
})
export class PhotoModule {}
