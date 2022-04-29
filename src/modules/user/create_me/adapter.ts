import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CreateMeUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

@Throttle(1, 0.1)
@Controller("user")
export class CreateMeAdapter extends Adapter {
  constructor(private readonly usecase: CreateMeUseCase) {
    super();
  }

  @Post("me")
  async receive(
    @AccessToken() accessToken: string,
    @Body() { name, email, avatar }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      name,
      email,
      avatar,
    });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 409;
      case 2:
        return 400;
      case 3:
        return 400;
      case 4:
        return 404;
      default:
        return 500;
    }
  }
}
