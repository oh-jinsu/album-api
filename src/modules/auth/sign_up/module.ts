import { Module } from "@nestjs/common";
import { SignUpAdapter } from "./adapter";
import { SignUpWithAppleUseCase } from "./with_apple/usecase";
import { SignUpWithGoogleUseCase } from "./with_google/usecase";

@Module({
  providers: [SignUpWithAppleUseCase, SignUpWithGoogleUseCase],
  controllers: [SignUpAdapter],
})
export class SignUpModule {}
