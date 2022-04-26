import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageRepository } from "src/declarations/repositories/image";

export interface Params {
  accessToken: string;
  buffer: Buffer;
  mimetype: string;
}

export interface Result {
  id: string;
  createdAt: Date;
}

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly imageRepository: ImageRepository,
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

    const { id: userId } = await this.authProvider.extractClaim(accessToken);

    const { id, createdAt } = await this.imageRepository.save({
      userId,
      buffer,
      mimetype,
    });

    return new UseCaseOk({
      id,
      createdAt,
    });
  }
}
