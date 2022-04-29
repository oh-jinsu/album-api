import { Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { SignOutUseCase } from "./usecase";

@Throttle(1, 0.1)
@Controller("auth/signout")
export class SignOutAdapter extends Adapter {
  constructor(private readonly usecase: SignOutUseCase) {
    super();
  }

  @Post()
  @HttpCode(204)
  async receive(@AccessToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 409;
      default:
        return 500;
    }
  }
}
