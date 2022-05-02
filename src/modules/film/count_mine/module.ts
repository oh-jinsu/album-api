import { Module } from "@nestjs/common";
import { CountMyFilmAdapter } from "./adapter";
import { CountMyFilmUseCase } from "./usecase";

@Module({
  providers: [CountMyFilmUseCase],
  controllers: [CountMyFilmAdapter],
})
export class CountMyFilmModule {}
