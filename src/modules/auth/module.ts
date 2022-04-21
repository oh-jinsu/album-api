import { Controller, Module } from '@nestjs/common';

@Controller()
export class AuthController {}

@Module({
  imports: [],
  controllers: [AuthController],
})
export class AuthModule {}
