import { Global, Module } from '@nestjs/common';
import { isProduction } from 'src/core/environments';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { GoogleAuthProviderImpl } from './google_auth';
import { MockGoogleAuthProvider } from './google_auth/mock';

@Global()
@Module({
  providers: [
    {
      provide: GoogleAuthProvider,
      useClass: isProduction ? GoogleAuthProviderImpl : MockGoogleAuthProvider,
    },
  ],
  exports: [GoogleAuthProvider],
})
export class ProviderModule {}
