import { Module } from "@nestjs/common";
import { UpdateMeAdapter } from "./adapter";
import { UpdateMeUseCase } from "./usecase";

@Module({
  providers: [UpdateMeUseCase],
  controllers: [UpdateMeAdapter],
})
export class UpdateMeModule {}
