import { Module } from "@nestjs/common";
import { AcceptInvitationAdapter } from "./adapter";
import { AcceptInvitationUseCase } from "./usecase";

@Module({
  providers: [AcceptInvitationUseCase],
  controllers: [AcceptInvitationAdapter],
})
export class AcceptInivitationModule {}
