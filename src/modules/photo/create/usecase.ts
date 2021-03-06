import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FilmRepository } from "src/declarations/repositories/film";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";

export interface Params {
  accessToken: string;
  albumId: string;
  image: string;
  date: Date;
  description?: string;
}

export interface Result {
  id: string;
  userId: string;
  albumId: string;
  publicImageUri: string;
  description: string;
  date: Date;
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreatePhotoUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly imageProvider: ImageProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly filmRepository: FilmRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { albumId, image, date, description }: Params,
  ): Promise<UseCaseResult<Result>> {
    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(1, "앨범을 찾지 못했습니다.");
    }

    const imageOption = await this.imageRepository.findOne(image);

    if (!imageOption.isSome()) {
      return new UseCaseException(2, "저장된 이미지를 찾지 못했습니다.");
    }

    const publicImageUri = await this.imageProvider.getPublicImageUri(image);

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
      date,
      image,
      description,
    });

    return new UseCaseOk({
      id: photo.id,
      userId,
      albumId,
      publicImageUri,
      description: photo.description,
      date: photo.date,
      updatedAt: photo.updatedAt,
      createdAt: photo.createdAt,
    });
  }
}
