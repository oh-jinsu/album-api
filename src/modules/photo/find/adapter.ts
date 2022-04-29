import { Controller, Get, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { FindPhotosUseCase } from "./usecase";

@Throttle(1, 0.1)
@Controller("photo")
export class FindPhotosAdapter extends Adapter {
  constructor(private readonly usecase: FindPhotosUseCase) {
    super();
  }

  @Get()
  async receive(
    @AccessToken() accessToken: string,
    @Query("album_id") albumId: string,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      albumId,
      limit: Number(limit) || null,
      cursor,
    });

    return this.response(result);
  }

  protected override getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 403;
      default:
        return 500;
    }
  }
}
