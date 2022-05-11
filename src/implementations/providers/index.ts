import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { HashProvider } from "src/declarations/providers/hash";
import { LinkProvider } from "src/declarations/providers/link";
import { AppleAuthProviderImpl } from "./apple_auth";
import { AuthProviderImpl } from "./auth";
import { GoogleAuthProviderImpl } from "./google_auth";
import { HashProviderImpl } from "./hash";
import { LinkProviderImpl } from "./link";

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [
    {
      provide: AuthProvider,
      useClass: AuthProviderImpl,
    },
    {
      provide: AppleAuthProvider,
      useClass: AppleAuthProviderImpl,
    },
    {
      provide: GoogleAuthProvider,
      useClass: GoogleAuthProviderImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    {
      provide: LinkProvider,
      useClass: LinkProviderImpl,
    },
  ],
  exports: [
    AuthProvider,
    AppleAuthProvider,
    GoogleAuthProvider,
    HashProvider,
    LinkProvider,
  ],
})
export class ProviderModule {}
