import { Module } from "@nestjs/common";
import { CountMyFilmModule } from "./count_mine/module";
import { PresentFilmsModule } from "./present/module";

@Module({
  imports: [CountMyFilmModule, PresentFilmsModule],
})
export class FilmModule {}
