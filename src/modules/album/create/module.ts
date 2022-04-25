import { Module } from "@nestjs/common";
import { CreateAlbumAdapter } from "./adapter";
import { CreateAlbumUseCase } from "./usecase";

@Module({
  providers: [CreateAlbumUseCase],
  controllers: [CreateAlbumAdapter],
})
export class CreateAlbumModule {}
