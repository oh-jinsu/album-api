import { Module } from "@nestjs/common";
import { CreateAlbumModule } from "./create/module";
import { ExitAlbumModule } from "./exit/module";
import { FindAlbumsModule } from "./find/module";

@Module({
  imports: [FindAlbumsModule, CreateAlbumModule, ExitAlbumModule],
})
export class AlbumModule {}
