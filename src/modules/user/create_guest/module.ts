import { Module } from "@nestjs/common";
import { CreateGuestAdapter } from "./adapter";
import { CreateGuestUseCase } from "./usecase";

@Module({
  providers: [CreateGuestUseCase],
  controllers: [CreateGuestAdapter],
})
export class CreateGuestModule {}
