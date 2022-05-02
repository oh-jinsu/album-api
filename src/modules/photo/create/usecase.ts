import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FilmRepository } from "src/declarations/repositories/film";
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
export class CreatePhotoUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly filmRepository: FilmRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { albumId, image, description }: Params,
  ): Promise<UseCaseResult<Result>> {
    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(1, "앨범을 찾지 못했습니다.");
    }

    const imageUriOption = await this.imageRepository.getPublicImageUri(image);

    if (!imageUriOption.isSome()) {
      return new UseCaseException(2, "저장된 이미지를 찾지 못했습니다.");
    }

    const films = await this.filmRepository.findEalistByUserId(userId, 1);

    if (films.length < 1) {
      return new UseCaseException(3, "필름이 부족합니다.");
    }

    for (const film of films) {
      await this.filmRepository.delete(film.id);
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
