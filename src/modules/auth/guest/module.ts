import { Module } from "@nestjs/common";
import { IssueGuestTokenAdapter } from "./adapter";
import { IssueGuestTokenUseCase } from "./usecase";

@Module({
  providers: [IssueGuestTokenUseCase],
  controllers: [IssueGuestTokenAdapter],
})
export class IssueGuestTokenModule {}
