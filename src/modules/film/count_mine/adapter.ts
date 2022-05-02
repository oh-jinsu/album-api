import { Controller, Get } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CountMyFilmUseCase } from "./usecase";

@Controller("film/count")
export class CountMyFilmAdapter extends Adapter {
  constructor(private readonly usecase: CountMyFilmUseCase) {
    super();
  }

  @Get()
  async receive(@AccessToken() accessToken: string) {
    const result = await this.usecase.execute({ accessToken });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
