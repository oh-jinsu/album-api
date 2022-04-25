import { Module } from "@nestjs/common";
import { FindAlbumsAdapter } from "./adapter";
import { FindAlbumsUseCase } from "./usecase";

@Module({
  providers: [FindAlbumsUseCase],
  controllers: [FindAlbumsAdapter],
})
export class FindAlbumsModule {}
