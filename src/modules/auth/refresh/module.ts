import { Module } from "@nestjs/common";
import { RefreshAuthAdapter } from "./adapter";
import { RefreshAuthUseCase } from "./usecase";

@Module({
  providers: [RefreshAuthUseCase],
  controllers: [RefreshAuthAdapter],
})
export class RefreshAuthModule {}
