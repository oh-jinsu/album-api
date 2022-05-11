import { Module } from "@nestjs/common";
import { GetInvitationLinkAdapter } from "./adapter";
import { GetInvitationLinkUseCase } from "./usecase";

@Module({
  providers: [GetInvitationLinkUseCase],
  controllers: [GetInvitationLinkAdapter],
})
export class GetInvitationLinkModule {}
