import { Module } from "@nestjs/common";
import { CreateGuestModule } from "./create_guest/module";
import { CreateMeModule } from "./create_me/module";
import { FindMeModule } from "./find_me/module";

@Module({
  imports: [FindMeModule, CreateMeModule, CreateGuestModule],
})
export class UserModule {}
