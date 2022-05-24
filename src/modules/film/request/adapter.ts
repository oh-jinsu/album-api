import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { RequestFilmUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  product_id: string;

  @IsString()
  source: "app_store" | "google_play";

  @IsString()
  token: string;
}

@Controller("film")
export class RequestFilmsAdapter extends Adapter {
  constructor(private readonly usecase: RequestFilmUseCase) {
    super();
  }

  @Post()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { source, token, product_id: productId }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      source,
      token,
      productId,
    });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
