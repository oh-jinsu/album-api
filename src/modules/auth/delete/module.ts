import { Module } from "@nestjs/common";
import { DeleteAuthUseCase } from "./usecase";
import { DeleteAuthAdapter } from "./adapter";

@Module({
  providers: [DeleteAuthUseCase],
  controllers: [DeleteAuthAdapter],
})
export class DeleteAuthModule {}
