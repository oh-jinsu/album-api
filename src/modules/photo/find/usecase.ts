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
import { FriendRepository } from "src/declarations/repositories/friend";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";

export interface Params {
  accessToken: string;
  albumId: string;
  limit?: number;
  cursor?: string;
}

export interface ResultItem {
  id: string;
  publicImageUri: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Result {
  next?: string;
  items: ResultItem[];
}

@Injectable()
export class FindPhotosUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly friendRepository: FriendRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);

    this.mapPhoto = this.mapPhoto.bind(this);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { albumId, limit, cursor }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(1, "앨범을 찾지 못했습니다.");
    }

    const friendOption = await this.friendRepository.findOne(userId, albumId);

    if (!friendOption.isSome()) {
      return new UseCaseException(2, "권한이 없습니다.");
    }

    const { next, items: photos } = await this.photoRepository.findByAlbumId(
      albumId,
      limit,
      cursor,
    );

    const items = await Promise.all(photos.map(this.mapPhoto).filter((e) => e));

    return new UseCaseOk({
      next,
      items,
    });
  }

  private async mapPhoto({ id, image, description, updatedAt, createdAt }) {
    const option = await this.imageRepository.getPublicImageUri(image);

    if (!option.isSome()) {
      return null;
    }

    const publicImageUri = option.value;

    return {
      id,
      publicImageUri,
      description,
      updatedAt,
      createdAt,
    };
  }
}
