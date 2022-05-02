import { Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CreateGuestUseCase } from "./usecase";

@Throttle(1, 0.1)
@Controller("user/guest")
export class CreateGuestAdapter extends Adapter {
  constructor(private readonly usecase: CreateGuestUseCase) {
    super();
  }

  @Post()
  async receive(@AccessToken() accessToken: string) {
    const result = await this.usecase.execute({
      accessToken,
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
