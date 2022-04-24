import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";

export interface Params {
  accessToken: string;
  buffer: Buffer;
  mimetype: string;
}

export interface Result {
  imageUri: string;
}

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly imageProvider: ImageProvider,
  ) {}

  async execute({
    accessToken,
    buffer,
    mimetype,
  }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const filename = new Date().toISOString();

    await this.imageProvider.put(filename, buffer, mimetype);

    const imageUri = await this.imageProvider.get(filename);

    return new UseCaseOk({
      imageUri,
    });
  }
}
