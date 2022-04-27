import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";

export interface Params {
  accessToken: string;
  albumId: string;
  image: string;
  description?: string;
}

export interface Result {
  id: string;
  publicImageUri: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreatePhotoUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute({
    accessToken,
    albumId,
    image,
    description,
  }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id: userId } = await this.authProvider.extractClaim(accessToken);

    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(2, "앨범을 찾지 못했습니다.");
    }

    const imageUriOption = await this.imageRepository.getPublicImageUri(image);

    if (!imageUriOption.isSome()) {
      return new UseCaseException(3, "저장된 이미지를 찾지 못했습니다.");
    }

    const photo = await this.photoRepository.save({
      userId,
      albumId,
      image,
      description,
    });

    return new UseCaseOk({
      id: photo.id,
      publicImageUri: imageUriOption.value,
      description: photo.description,
      updatedAt: photo.updatedAt,
      createdAt: photo.createdAt,
    });
  }
}
