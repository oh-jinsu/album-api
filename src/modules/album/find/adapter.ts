import { Controller, Get, Query } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { FindAlbumsUseCase } from "./usecase";

@Controller("album")
export class FindAlbumsAdapter extends Adapter {
  constructor(private readonly usecase: FindAlbumsUseCase) {
    super();
  }

  @Get()
  async receive(
    @AccessToken() accessToken: string,
    @Query("cursor") cursor: string,
    @Query("limit") limit: string,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      cursor,
      limit: Number(limit),
    });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 401;
      default:
        return 500;
    }
  }
}
