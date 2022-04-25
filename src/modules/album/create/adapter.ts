import { Body, Controller, Headers, Post } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { CreateAlbumUseCase } from "./usecase";

export class RequestBody {
  @IsNotEmpty()
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
    @Headers("Authorization") authorization: string,
    @Body() { title }: RequestBody,
  ) {
    const accessToken = authorization.split(" ")[1];

    const result = await this.usecase.execute({ accessToken, title });

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
