import { Module } from "@nestjs/common";
import { FindMeModule } from "./find_me/module";

@Module({
  imports: [FindMeModule],
})
export class UserModule {}
