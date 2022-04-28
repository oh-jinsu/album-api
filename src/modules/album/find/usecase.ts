import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { AlbumModel } from "src/declarations/models/album";
import { ClaimModel } from "src/declarations/models/claim";
import { FriendModel } from "src/declarations/models/friend";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FriendRepository } from "src/declarations/repositories/friend";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  cursor?: string;
  limit?: number;
}

export interface UserResult {
  id: string;
  email?: string;
  avatar: string;
  joinedAt: Date;
}

export interface ResultItem {
  id: string;
  title: string;
  photoCount: number;
  coverImageUri?: string;
  users: UserResult[];
  updatedAt: Date;
  createdAt: Date;
}

export interface Result {
  next?: string;
  items: ResultItem[];
}

@Injectable()
export class FindAlbumsUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly albumRepository: AlbumRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
    this.mapAlbum = this.mapAlbum.bind(this);
    this.mapFriend = this.mapFriend.bind(this);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { cursor, limit }: Params,
  ): Promise<UseCaseResult<Result>> {
    const { next, items: albums } = await this.albumRepository.findByUserId(
      userId,
      limit,
      cursor,
    );

    const items = await Promise.all(albums.map(this.mapAlbum));

    return new UseCaseOk({
      next,
      items,
    });
  }

  private async mapAlbum({
    id,
    title,
    updatedAt,
    createdAt,
  }: AlbumModel): Promise<ResultItem> {
    const photoCount = await this.photoRepository.countByAlbumId(id);

    const photoOption = await this.photoRepository.findLatestByAlbumId(id);

    const coverImageUriOption = photoOption.isSome()
      ? await this.imageRepository.getPublicImageUri(photoOption.value.image)
      : null;

    const coverImageUri = coverImageUriOption?.isSome()
      ? coverImageUriOption.value
      : null;

    const friends = await this.friendRepository.findByAlbumId(id);

    const users = await Promise.all(
      friends.map(this.mapFriend).filter((e) => e),
    );

    return {
      id,
      title,
      coverImageUri,
      photoCount,
      users,
      updatedAt,
      createdAt,
    };
  }

  private async mapFriend({
    userId,
    createdAt: joinedAt,
  }: FriendModel): Promise<UserResult | null> {
    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return null;
    }

    const { id, email, avatar } = userOption.value;

    return {
      id,
      email,
      avatar,
      joinedAt,
    };
  }
}
