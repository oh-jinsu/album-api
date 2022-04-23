import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { AppleAuthProviderImpl } from "./apple_auth";
import { GoogleAuthProviderImpl } from "./google_auth";

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [
    {
      provide: AppleAuthProvider,
      useClass: AppleAuthProviderImpl,
    },
    {
      provide: GoogleAuthProvider,
      useClass: GoogleAuthProviderImpl,
    },
  ],
  exports: [AppleAuthProvider, GoogleAuthProvider],
})
export class ProviderModule {}
