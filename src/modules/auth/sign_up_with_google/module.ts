import { Module } from "@nestjs/common";
import { SignUpWithGoogleAdapter } from "./adapter";
import { SignUpWithGoogleUseCase } from "./usecase";

@Module({
  providers: [SignUpWithGoogleUseCase],
  controllers: [SignUpWithGoogleAdapter],
})
export class SignUpWithGoogleModule {}
