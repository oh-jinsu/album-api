import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Adapter } from "src/core/adapter";
import { Express } from "express";
import { UploadImageUseCase } from "./usecase";
import { AccessToken } from "src/core/decorators/access_token";
import { Throttle } from "@nestjs/throttler";

@Throttle(1, 0.1)
@Controller("util/image")
export class UploadImageAdapter extends Adapter {
  constructor(private readonly usecase: UploadImageUseCase) {
    super();
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async receive(
    @AccessToken() accessToken: string,
    @UploadedFile() { buffer, mimetype }: Express.Multer.File,
  ) {
    const result = await this.usecase.execute({
      accessToken,
      buffer,
      mimetype,
    });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      default:
        return 500;
    }
  }
}
