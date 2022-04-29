import { Controller, Get } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { FindMeUseCase } from "./usecase";

@Controller("user")
export class FindMeAdapter extends Adapter {
  constructor(private readonly usecase: FindMeUseCase) {
    super();
  }

  @Get("me")
  async receive(@AccessToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      default:
        return 500;
    }
  }
}
