import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { AlbumRepository } from "src/declarations/repositories/album";

export interface Params {
  accessToken: string;
  title: string;
}

export interface Result {
  id: string;
  title: string;
  createdAt: Date;
}

@Injectable()
export class CreateAlbumUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
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

    return new UseCaseOk({
      id: album.id,
      title: album.title,
      createdAt: album.createdAt,
    });
  }
}
