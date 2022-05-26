import { Body, Controller, Patch } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { UpdateMeDto, UpdateMeUseCase } from "./usecase";

@Controller("user/me")
export class UpdateMeAdapter extends Adapter {
  constructor(private readonly usecase: UpdateMeUseCase) {
    super();
  }

  @Patch()
  async receive(
    @AccessToken() accessToken: string,
    @Body() dtos: UpdateMeDto[],
  ) {
    const result = await this.usecase.execute({
      accessToken,
      dtos,
    });

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
