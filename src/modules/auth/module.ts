import { Module } from "@nestjs/common";
import { SignInWithGoogleAdapter } from "./sign_in_with_google/adapter";
import { SignInWithGoogleUseCase } from "./sign_in_with_google/usecase";
import { SignUpWithAppleAdapter } from "./sign_up_with_apple/adapter";
import { SignUpWithAppleUseCase } from "./sign_up_with_apple/usecase";
import { SignUpWithGoogleAdapter } from "./sign_up_with_google/adapter";
import { SignUpWithGoogleUseCase } from "./sign_up_with_google/usecase";

@Module({
  providers: [
    SignInWithGoogleUseCase,
    SignUpWithAppleUseCase,
    SignUpWithGoogleUseCase,
  ],
  controllers: [
    SignInWithGoogleAdapter,
    SignUpWithAppleAdapter,
    SignUpWithGoogleAdapter,
  ],
})
export class AuthModule {}
