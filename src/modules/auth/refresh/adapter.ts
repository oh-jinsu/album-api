import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { RefreshAuthUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  refresh_token: string;
}

@Throttle(1, 0.1)
@Controller("auth/refresh")
export class RefreshAuthAdapter extends Adapter {
  constructor(private readonly usecase: RefreshAuthUseCase) {
    super();
  }

  @Post()
  async receive(@Body() { refresh_token: refreshToken }: RequestBody) {
    const result = await this.usecase.execute({ refreshToken });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 401;
      default:
        return 500;
    }
  }
}
