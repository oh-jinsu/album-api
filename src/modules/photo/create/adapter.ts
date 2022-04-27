import { Body, Controller, Post } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CreatePhotoUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  albumId: string;

  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  description?: string;
}

@Controller("photo")
export class CreatePhotoAdapter extends Adapter {
  constructor(private readonly usecase: CreatePhotoUseCase) {
    super();
  }

  @Post()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { albumId, image, description }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      albumId,
      image,
      description,
    });

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