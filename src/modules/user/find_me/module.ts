import { Module } from "@nestjs/common";
import { FindMeAdapter } from "./adapter";
import { FindMeUseCase } from "./usecase";

@Module({
  providers: [FindMeUseCase],
  controllers: [FindMeAdapter],
})
export class FindMeModule {}
