import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { HashProvider } from "src/declarations/providers/hash";
import { ImageProvider } from "src/declarations/providers/image";
import { AppleAuthProviderImpl } from "./apple_auth";
import { AuthProviderImpl } from "./auth";
import { GoogleAuthProviderImpl } from "./google_auth";
import { HashProviderImpl } from "./hash";
import { ImageProviderImpl } from "./image";

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
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
  ],
  exports: [
    AuthProvider,
    AppleAuthProvider,
    GoogleAuthProvider,
    HashProvider,
    ImageProvider,
  ],
})
export class ProviderModule {}
