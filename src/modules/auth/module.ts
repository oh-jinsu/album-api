import { Module } from '@nestjs/common';
import { ProviderModule } from 'src/implementations/providers';
import { RepositoryModule } from 'src/implementations/repositories';
import { SignUpWithGoogleAdapter } from './sign_up_with_google/adapter';
import { SignUpWithGoogleUseCase } from './sign_up_with_google/usecase';

@Module({
  imports: [ProviderModule, RepositoryModule],
  providers: [SignUpWithGoogleUseCase],
  controllers: [SignUpWithGoogleAdapter],
})
export class AuthModule {}
