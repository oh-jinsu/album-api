import { Module } from "@nestjs/common";
import { DeleteAuthModule } from "./delete/module";
import { IssueGuestTokenModule } from "./guest/module";
import { RefreshAuthModule } from "./refresh/module";
import { SignInModule } from "./sign_in/module";
import { SignOutModule } from "./sign_out/module";
import { SignUpModule } from "./sign_up/module";

@Module({
  imports: [
    SignUpModule,
    SignInModule,
    RefreshAuthModule,
    SignOutModule,
    IssueGuestTokenModule,
    DeleteAuthModule,
  ],
})
export class AuthModule {}
