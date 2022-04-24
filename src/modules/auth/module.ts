import { Module } from "@nestjs/common";
import { RefreshAuthModule } from "./refresh/module";
import { SignInWithAppleModule } from "./sign_in_with_apple/module";
import { SignInWithGoogleModule } from "./sign_in_with_google/module";
import { SignUpWithAppleModule } from "./sign_up_with_apple/module";
import { SignUpWithGoogleModule } from "./sign_up_with_google/module";

@Module({
  imports: [
    SignInWithAppleModule,
    SignInWithGoogleModule,
    SignUpWithAppleModule,
    SignUpWithGoogleModule,
    RefreshAuthModule,
  ],
})
export class AuthModule {}
