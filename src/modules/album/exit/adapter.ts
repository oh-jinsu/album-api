import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { ExitAlbumUseCase } from "./usecase";

@Throttle(1, 0.1)
@Controller("album")
export class ExitAlbumAdapter extends Adapter {
  constructor(private readonly usecase: ExitAlbumUseCase) {
    super();
  }

  @Delete(":id")
  @HttpCode(204)
  async receive(
    @AccessToken() accessToken: string,
    @Param("id") albumId: string,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      albumId,
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
