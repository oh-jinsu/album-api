import { Module } from "@nestjs/common";
import { SignInAdapter } from "./adapter";
import { SignInWithAppleUseCase } from "./with_apple/usecase";
import { SignInWithGoogleUseCase } from "./with_google/usecase";

@Module({
  providers: [SignInWithAppleUseCase, SignInWithGoogleUseCase],
  controllers: [SignInAdapter],
})
export class SignInModule {}
