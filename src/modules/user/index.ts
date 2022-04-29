import { Module } from "@nestjs/common";
import { CreateMeModule } from "./create_me/module";
import { FindMeModule } from "./find_me/module";

@Module({
  imports: [FindMeModule, CreateMeModule],
})
export class UserModule {}
