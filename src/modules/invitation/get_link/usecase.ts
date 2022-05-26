import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { LinkProvider } from "src/declarations/providers/link";
import { AlbumRepository } from "src/declarations/repositories/album";
import { FriendRepository } from "src/declarations/repositories/friend";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  albumId: string;
}

export interface Result {
  url: string;
}

@Injectable()
export class GetInvitationLinkUseCase extends AuthorizedUseCase<
  Params,
  Result
> {
  constructor(
    authProvider: AuthProvider,
    private readonly linkProvider: LinkProvider,
    private readonly albumRepository: AlbumRepository,
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "member";
  }

  async executeWithAuth(
    { id: userId }: ClaimModel,
    { albumId }: Params,
  ): Promise<UseCaseResult<Result>> {
    const albumOption = await this.albumRepository.findOne(albumId);

    if (!albumOption.isSome()) {
      return new UseCaseException(1, "앨범을 찾지 못했습니다.");
    }

    const friendOption = await this.friendRepository.findOne(userId, albumId);

    if (!friendOption.isSome()) {
      return new UseCaseException(2, "권한이 없습니다.");
    }

    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return new UseCaseException(3, "이용자를 찾지 못했습니다.");
    }

    const token = await this.authProvider.issueInvitationToken({
      sub: albumId,
      title: albumOption.value.title,
      owner: userOption.value.name,
    });

    const url = await this.linkProvider.getLink(`invitation?token=${token}`);

    return new UseCaseOk({
      url,
    });
  }
}
