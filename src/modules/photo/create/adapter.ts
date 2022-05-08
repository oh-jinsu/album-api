import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { Adapter } from "src/core/adapter";
import { AccessToken } from "src/core/decorators/access_token";
import { CreatePhotoUseCase } from "./usecase";

export class RequestBody {
  @IsString()
  album_id: string;

  @IsString()
  image: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}

@Throttle(1, 0.1)
@Controller("photo")
export class CreatePhotoAdapter extends Adapter {
  constructor(private readonly usecase: CreatePhotoUseCase) {
    super();
  }

  @Post()
  async receive(
    @AccessToken() accessToken: string,
    @Body() { album_id: albumId, image, date, description }: RequestBody,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      albumId,
      date: new Date(date),
      image,
      description,
    });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 404;
      case 2:
        return 404;
      case 3:
        return 409;
      default:
        return 500;
    }
  }
}
