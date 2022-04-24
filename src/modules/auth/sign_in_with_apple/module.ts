import { Module } from "@nestjs/common";
import { SignInWithAppleAdapter } from "./adapter";
import { SignInWithAppleUseCase } from "./usecase";

@Module({
  providers: [SignInWithAppleUseCase],
  controllers: [SignInWithAppleAdapter],
})
export class SignInWithAppleModule {}
