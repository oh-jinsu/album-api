import { Module } from "@nestjs/common";
import { SignUpWithAppleAdapter } from "./sign_up_with_apple/adapter";
import { SignUpWithAppleUseCase } from "./sign_up_with_apple/usecase";
import { SignUpWithGoogleAdapter } from "./sign_up_with_google/adapter";
import { SignUpWithGoogleUseCase } from "./sign_up_with_google/usecase";

@Module({
  providers: [SignUpWithAppleUseCase, SignUpWithGoogleUseCase],
  controllers: [SignUpWithAppleAdapter, SignUpWithGoogleAdapter],
})
export class AuthModule {}
