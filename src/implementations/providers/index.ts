import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { isProduction } from 'src/core/environment';
import { AppleAuthProvider } from 'src/declarations/providers/apple_auth';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { AppleAuthProviderImpl } from './apple_auth';
import { MockAppleAuthProvider } from './apple_auth/mock';
import { GoogleAuthProviderImpl } from './google_auth';
import { MockGoogleAuthProvider } from './google_auth/mock';

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [
    {
      provide: AppleAuthProvider,
      useClass: isProduction ? AppleAuthProviderImpl : MockAppleAuthProvider,
    },
    {
      provide: GoogleAuthProvider,
      useClass: isProduction ? GoogleAuthProviderImpl : MockGoogleAuthProvider,
    },
  ],
  exports: [AppleAuthProvider, GoogleAuthProvider],
})
export class ProviderModule {}
