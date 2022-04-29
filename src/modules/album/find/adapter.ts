import { Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { FindAlbumsUseCase } from "./usecase";

@Throttle(1, 0.1)
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
      limit: Number(limit) || null,
    });

    return this.response(result);
  }

  protected override getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
