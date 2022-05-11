import { Module } from "@nestjs/common";
import { GetInvitationLinkModule } from "./get_link/module";

@Module({
  imports: [GetInvitationLinkModule],
})
export class InvitationModule {}
