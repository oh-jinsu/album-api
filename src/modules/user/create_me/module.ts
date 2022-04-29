import { Module } from "@nestjs/common";
import { CreateMeAdapter } from "./adapter";
import { CreateMeUseCase } from "./usecase";

@Module({
  providers: [CreateMeUseCase],
  controllers: [CreateMeAdapter],
})
export class CreateMeModule {}
