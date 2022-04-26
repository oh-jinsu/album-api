import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FriendRepository } from "src/declarations/repositories/friend";
import { PhotoRepository } from "src/declarations/repositories/photo";

export interface Params {
  accessToken: string;
  title: string;
}

export interface Result {
  id: string;
  title: string;
  photoCount: number;
  cover?: string;
  friendIds: string[];
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreateAlbumUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly friendRepository: FriendRepository,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async execute({
    accessToken,
    title,
  }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id: userId } = await this.authProvider.extractClaim(accessToken);

    const album = await this.albumRepository.save({
      userId,
      title,
    });

    const friend = await this.friendRepository.save({
      userId,
      albumId: album.id,
    });

    const photoCount = await this.photoRepository.countByAlbumId(album.id);

    const option = await this.photoRepository.findLatestByAlbumId(album.id);

    const cover = option.isSome() ? option.value.imageUri : null;

    return new UseCaseOk({
      id: album.id,
      title: album.title,
      photoCount,
      cover,
      friendIds: [friend.userId],
      updatedAt: album.updatedAt,
      createdAt: album.createdAt,
    });
  }
}
