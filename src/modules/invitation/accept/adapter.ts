import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { AcceptInvitationUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  invitation_token: string;
}

@Controller("invitation/accept")
export class AcceptInvitationAdapter extends Adapter {
  constructor(private readonly usecase: AcceptInvitationUseCase) {
    super();
  }

  @Post()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { invitation_token: invitationToken, ...dto }: RequestBody,
  ) {
    console.log(invitationToken, dto);
    const result = await this.usecase.execute({ accessToken, invitationToken });

    return this.response(result);
  }

  protected getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 401;
      case 2:
        return 404;
      case 3:
        return 409;
      default:
        return 500;
    }
  }
}
