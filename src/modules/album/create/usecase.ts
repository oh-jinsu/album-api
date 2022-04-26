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
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  title: string;
}

export interface UserResult {
  id: string;
  email?: string;
  avatar: string;
  joinedAt: Date;
}

export interface Result {
  id: string;
  title: string;
  photoCount: number;
  cover?: string;
  users: UserResult[];
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
    private readonly userRepository: UserRepository,
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

    const userOption = await this.userRepository.findOne(friend.userId);

    if (!userOption.isSome()) {
      return new UseCaseException(2, "이용자를 찾지 못했습니다.");
    }

    const user = userOption.value;

    const photoCount = await this.photoRepository.countByAlbumId(album.id);

    const latestPhotoOption = await this.photoRepository.findLatestByAlbumId(
      album.id,
    );

    const cover = latestPhotoOption.isSome()
      ? latestPhotoOption.value.imageUri
      : null;

    return new UseCaseOk({
      id: album.id,
      title: album.title,
      photoCount,
      cover,
      users: [
        {
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          joinedAt: friend.createdAt,
        },
      ],
      updatedAt: album.updatedAt,
      createdAt: album.createdAt,
    });
  }
}
