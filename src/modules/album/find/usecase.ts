import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AlbumModel } from "src/declarations/models/album";
import { FriendModel } from "src/declarations/models/friend";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FriendRepository } from "src/declarations/repositories/friend";
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
  cover?: string;
  users: UserResult[];
  updatedAt: Date;
  createdAt: Date;
}

export interface Result {
  next?: string;
  items: ResultItem[];
}

@Injectable()
export class FindAlbumsUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly albumRepository: AlbumRepository,
    private readonly photoRepository: PhotoRepository,
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.mapAlbum = this.mapAlbum.bind(this);
    this.mapFriend = this.mapFriend.bind(this);
  }

  async execute({
    accessToken,
    cursor,
    limit,
  }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id: userId } = await this.authProvider.extractClaim(accessToken);

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

    const option = await this.photoRepository.findLatestByAlbumId(id);

    const cover = option.isSome() ? option.value.image : null;

    const friends = await this.friendRepository.findByAlbumId(id);

    const users = await Promise.all(
      friends.map(this.mapFriend).filter((e) => e),
    );

    return {
      id,
      title,
      cover,
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
