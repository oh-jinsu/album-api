import { Module } from "@nestjs/common";
import { UploadImageAdapter } from "./adapter";
import { UploadImageUseCase } from "./usecase";

@Module({
  providers: [UploadImageUseCase],
  controllers: [UploadImageAdapter],
})
export class UploadImageModule {}
