import { Module } from '@nestjs/common';
import { SignUpWithGoogleAdapter } from './sign_up_with_google/adapter';
import { SignUpWithGoogleUseCase } from './sign_up_with_google/usecase';

@Module({
  providers: [SignUpWithGoogleUseCase],
  controllers: [SignUpWithGoogleAdapter],
})
export class AuthModule {}
