import { Module } from "@nestjs/common";
import { PresentFilmsAdapter } from "./adapter";
import { PresentFilmsUseCase } from "./usecase";

@Module({
  providers: [PresentFilmsUseCase, PresentFilmsAdapter],
})
export class PresentFilmsModule {}
