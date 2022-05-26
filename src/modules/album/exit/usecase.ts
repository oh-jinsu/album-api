import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
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
}

export type Result = Record<string, never>;

@Injectable()
export class ExitAlbumUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly albumRepository: AlbumRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly friendRepository: FriendRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { albumId }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(1, "앨범을 찾지 못했습니다.");
    }

    const friendOption = await this.friendRepository.findOne(userId, albumId);

    if (!friendOption.isSome()) {
      return new UseCaseException(2, "권한이 없습니다.");
    }

    const friend = friendOption.value;

    await this.friendRepository.delete(friend.id);

    const friends = await this.friendRepository.findByAlbumId(albumId);

    if (friends.length === 0) {
      const { items: photos } = await this.photoRepository.findByAlbumId(
        albumId,
      );

      await Promise.all(
        photos.map(async ({ id, image }) =>
          Promise.all([
            this.imageRepository.delete(image),
            this.photoRepository.delete(id),
          ]),
        ),
      );

      await this.albumRepository.delete(albumId);
    }

    return new UseCaseOk(null);
  }
}
