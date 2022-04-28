import { Module } from "@nestjs/common";
import { ExitAlbumAdapter } from "./adapter";
import { ExitAlbumUseCase } from "./usecase";

@Module({
  providers: [ExitAlbumUseCase],
  controllers: [ExitAlbumAdapter],
})
export class ExitAlbumModule {}
