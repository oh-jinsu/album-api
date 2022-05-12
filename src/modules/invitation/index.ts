import { Module } from "@nestjs/common";
import { AcceptInivitationModule } from "./accept/module";
import { GetInvitationLinkModule } from "./get_link/module";

@Module({
  imports: [GetInvitationLinkModule, AcceptInivitationModule],
})
export class InvitationModule {}
