import { Controller, HttpCode, Post } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { SignOutUseCase } from "./usecase";

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
        return 401;
      case 2:
        return 404;
      case 3:
        return 409;
      default:
        return 500;
    }
  }
}
