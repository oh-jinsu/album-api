import { Module } from "@nestjs/common";
import { CountMyFilmModule } from "./count_mine/module";

@Module({
  imports: [CountMyFilmModule],
})
export class FilmModule {}
