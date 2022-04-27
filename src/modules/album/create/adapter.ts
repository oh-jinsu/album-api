import { Body, Controller, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CreateAlbumUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  title: string;
}

@Controller("album")
export class CreateAlbumAdapter extends Adapter {
  constructor(private readonly usecase: CreateAlbumUseCase) {
    super();
  }

  @Post()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { title }: RequestBody,
  ) {
    const result = await this.usecase.execute({ accessToken, title });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 401;
      case 2:
        return 404;
      default:
        return 500;
    }
  }
}
