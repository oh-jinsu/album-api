import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";

export interface Params {
  accessToken: string;
  id: string;
}

export type Result = Record<string, never>;

@Injectable()
export class DeletePhotoUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { id }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const photoOption = await this.photoRepository.findOne(id);

    if (!photoOption.isSome()) {
      return new UseCaseException(1, "사진을 찾지 못했습니다.");
    }

    const photo = photoOption.value;

    if (photo.userId !== userId) {
      return new UseCaseException(2, "권한이 없습니다.");
    }

    await Promise.all([
      this.photoRepository.delete(id),
      this.imageRepository.delete(photo.id),
    ]);

    return new UseCaseOk(null);
  }
}
