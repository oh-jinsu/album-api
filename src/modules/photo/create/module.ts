import { Module } from "@nestjs/common";
import { CreatePhotoAdapter } from "./adapter";
import { CreatePhotoUseCase } from "./usecase";

@Module({
  providers: [CreatePhotoUseCase],
  controllers: [CreatePhotoAdapter],
})
export class CreatePhotoModule {}
