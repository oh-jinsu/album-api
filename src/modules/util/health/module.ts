import { Module } from "@nestjs/common";
import { HealthAdapter } from "./adapter";

@Module({
  controllers: [HealthAdapter],
})
export class HealthModule {}
