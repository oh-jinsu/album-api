import { Module } from "@nestjs/common";
import { SignInWithGoogleAdapter } from "./adapter";
import { SignInWithGoogleUseCase } from "./usecase";

@Module({
  providers: [SignInWithGoogleUseCase],
  controllers: [SignInWithGoogleAdapter],
})
export class SignInWithGoogleModule {}
