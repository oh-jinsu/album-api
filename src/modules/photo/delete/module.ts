import { Module } from "@nestjs/common";
import { DeletePhotoAdapter } from "./adapter";
import { DeletePhotoUseCase } from "./usecase";

@Module({
  providers: [DeletePhotoUseCase],
  controllers: [DeletePhotoAdapter],
})
export class DeletePhotoModule {}
