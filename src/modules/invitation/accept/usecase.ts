import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FriendRepository } from "src/declarations/repositories/friend";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  invitationToken: string;
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
export class AcceptInvitationUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly albumRepository: AlbumRepository,
    private readonly friendRepository: FriendRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "member";
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { invitationToken }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyInvitationToken(
      invitationToken,
    );

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const userOption = await this.userRepository.findOne(userId);

    if (userOption.isNone()) {
      return new UseCaseException(2, "이용자를 찾지 못했습니다.");
    }

    const { id: albumId } = await this.authProvider.extractInvitationClaim(
      invitationToken,
    );

    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(3, "앨범을 찾지 못했습니다.");
    }

    const friendOption = await this.friendRepository.findOne(userId, albumId);

    if (friendOption.isSome()) {
      return new UseCaseException(4, "이미 참여한 앨범입니다.");
    }

    await this.friendRepository.save({
      userId,
      albumId,
    });

    const album = albumOption.value;

    const photoCount = await this.photoRepository.countByAlbumId(albumId);

    const latestPhotoOption = await this.photoRepository.findLatestByAlbumId(
      albumId,
    );

    const coverImageUriOption = latestPhotoOption.isSome()
      ? await this.imageRepository.getPublicImageUri(
          latestPhotoOption.value.image,
        )
      : null;

    const coverImageUri = coverImageUriOption?.isSome()
      ? coverImageUriOption.value
      : null;

    const friends = await this.friendRepository.findByAlbumId(albumId);

    const userPromises = friends
      .map(async ({ userId, createdAt: joinedAt }) => {
        const userOption = await this.userRepository.findOne(userId);

        if (!userOption.isSome()) {
          return null;
        }

        const { id, email, name, avatar } = userOption.value;

        const avatarImageUriOption = avatar
          ? await this.imageRepository.getPublicImageUri(avatar)
          : null;

        const avatarImageUri = avatarImageUriOption?.isSome()
          ? avatarImageUriOption.value
          : null;

        return {
          id,
          email,
          name,
          avatarImageUri,
          joinedAt,
        };
      })
      .filter((e) => e);

    const users = await Promise.all(userPromises);

    return new UseCaseOk({
      id: albumId,
      title: album.title,
      photoCount,
      coverImageUri,
      users,
      updatedAt: album.updatedAt,
      createdAt: album.createdAt,
    });
  }
}
