import { Module } from "@nestjs/common";
import { SignOutAdapter } from "./adapter";
import { SignOutUseCase } from "./usecase";

@Module({
  providers: [SignOutUseCase],
  controllers: [SignOutAdapter],
})
export class SignOutModule {}
