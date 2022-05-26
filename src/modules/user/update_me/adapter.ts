import { Body, Controller, Patch } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { UpdateMeUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar_id?: string;
}

@Controller("user/me")
export class UpdateMeAdapter extends Adapter {
  constructor(private readonly usecase: UpdateMeUseCase) {
    super();
  }

  @Patch()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { name, email, avatar_id: avatarId }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      name,
      email,
      avatarId,
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
