import { Module } from "@nestjs/common";
import { FindPhotosAdapter } from "./adapter";
import { FindPhotosUseCase } from "./usecase";

@Module({
  providers: [FindPhotosUseCase],
  controllers: [FindPhotosAdapter],
})
export class FindPhotosModule {}
