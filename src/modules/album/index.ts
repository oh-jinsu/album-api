import { Module } from "@nestjs/common";
import { CreateAlbumModule } from "./create/module";
import { FindAlbumsModule } from "./find/module";

@Module({
  imports: [FindAlbumsModule, CreateAlbumModule],
})
export class AlbumModule {}
