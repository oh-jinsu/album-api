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
  name: string;
  avatarImageUri?: string;
  joinedAt: Date;
}

export interface Result {
  id: string;
  title: string;
  photoCount: number;
  coverImageUri?: string;
  users: UserResult[];
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreateAlbumUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly photoRepository: PhotoRepository,
    private readonly friendRepository: FriendRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly userRepository: UserRepository,
    private readonly imageProvider: ImageProvider,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { title }: Params,
  ): Promise<UseCaseResult<Result>> {
    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    const album = await this.albumRepository.save({
      title,
    });

    const friend = await this.friendRepository.save({
      userId,
      albumId: album.id,
    });

    const user = userOption.value;

    const avatarImageUri = user.avatar
      ? await this.imageProvider.getPublicImageUri(user.avatar)
      : null;

    const photoCount = await this.photoRepository.countByAlbumId(album.id);

    const latestPhotoOption = await this.photoRepository.findLatestByAlbumId(
      album.id,
    );

    const coverImageUri = latestPhotoOption.isSome()
      ? await this.imageProvider.getPublicImageUri(
          latestPhotoOption.value.image,
        )
      : null;

    return new UseCaseOk({
      id: album.id,
      title: album.title,
      photoCount,
      coverImageUri,
      users: [
        {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarImageUri,
          joinedAt: friend.createdAt,
        },
      ],
      updatedAt: album.updatedAt,
      createdAt: album.createdAt,
    });
  }
}
