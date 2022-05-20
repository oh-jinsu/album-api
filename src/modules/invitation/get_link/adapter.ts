import { Controller, Get, Query } from "@nestjs/common";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { GetInvitationLinkUseCase } from "./usecase";

@Controller("invitation")
export class GetInvitationLinkAdapter extends Adapter {
  constructor(private readonly usecase: GetInvitationLinkUseCase) {
    super();
  }

  @Get()
  async receive(
    @AccessToken() accessToken: string,
    @Query("album_id") albumId: string,
  ) {
    const result = await this.usecase.execute({ accessToken, albumId });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 403;
      case 3:
        return 404;
      default:
        return 500;
    }
  }
}
