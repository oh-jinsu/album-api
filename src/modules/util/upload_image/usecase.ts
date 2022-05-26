import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
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
export class UploadImageUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { buffer, mimetype }: Params,
  ): Promise<UseCaseResult<Result>> {
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
