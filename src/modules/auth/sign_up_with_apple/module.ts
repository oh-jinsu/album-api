import { Module } from "@nestjs/common";
import { SignUpWithAppleAdapter } from "./adapter";
import { SignUpWithAppleUseCase } from "./usecase";

@Module({
  providers: [SignUpWithAppleUseCase],
  controllers: [SignUpWithAppleAdapter],
})
export class SignUpWithAppleModule {}
