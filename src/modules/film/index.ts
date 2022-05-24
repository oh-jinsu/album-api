import { Module } from "@nestjs/common";
import { CountMyFilmModule } from "./count_mine/module";
import { PresentFilmsModule } from "./present/module";
import { RequestFilmsModule } from "./request/module";

@Module({
  imports: [CountMyFilmModule, PresentFilmsModule, RequestFilmsModule],
})
export class FilmModule {}
