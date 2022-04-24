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

@Controller("util/image")
export class UploadImageAdapter extends Adapter {
  constructor(private readonly usecase: UploadImageUseCase) {
    super();
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async receive(@UploadedFile() { buffer, mimetype }: Express.Multer.File) {
    const result = await this.usecase.execute({
      accessToken: "accessToken",
      buffer,
      mimetype,
    });

    return this.response(result);
  }

  getExceptionStatus(code: number): number {
    switch (code) {
      case 1:
        return 400;
      default:
        return 500;
    }
  }
}
