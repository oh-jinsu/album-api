import { Module } from "@nestjs/common";
import { SignInWithGoogleModule } from "./sign_in_with_google/module";
import { SignUpWithAppleModule } from "./sign_up_with_apple/module";
import { SignUpWithGoogleModule } from "./sign_up_with_google/module";

@Module({
  imports: [
    SignInWithGoogleModule,
    SignUpWithAppleModule,
    SignUpWithGoogleModule,
  ],
})
export class AuthModule {}
