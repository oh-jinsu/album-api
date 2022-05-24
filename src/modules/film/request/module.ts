import { Module } from "@nestjs/common";
import { RequestFilmsAdapter } from "./adapter";
import { RequestFilmUseCase as RequestFilmsUseCase } from "./usecase";

@Module({
  controllers: [RequestFilmsAdapter],
  providers: [RequestFilmsUseCase],
})
export class RequestFilmsModule {}
