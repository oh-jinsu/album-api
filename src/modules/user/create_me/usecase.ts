import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { ImageRepository } from "src/declarations/repositories/image";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  email?: string;
  name: string;
  avatar?: string;
}

export interface Result {
  id: string;
  email?: string;
  name: string;
  avatarImageUri?: string;
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreateMeUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly imageProvider: ImageProvider,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "member";
  }

  protected async executeWithAuth(
    { id }: ClaimModel,
    { email, name, avatar }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isNone()) {
      return new UseCaseException(1, "이미 등록된 이용자입니다.");
    }

    const nameLength = ~-encodeURI(name).split(/%..|./).length;

    if (nameLength < 2) {
      return new UseCaseException(2, "이름이 너무 짧습니다.");
    }

    if (nameLength > 24) {
      return new UseCaseException(3, "이름이 너무 깁니다.");
    }

    let avatarImageUri = null;

    if (avatar) {
      const imageOption = await this.imageRepository.findOne(avatar);

      if (!imageOption.isSome()) {
        return new UseCaseException(4, "저장된 이미지를 찾지 못했습니다.");
      }

      avatarImageUri = await this.imageProvider.getPublicImageUri(avatar);
    }

    const { updatedAt, createdAt } = await this.userRepository.save({
      id,
      name,
      email,
      avatar,
    });

    return new UseCaseOk({
      id,
      email,
      name,
      avatarImageUri,
      updatedAt,
      createdAt,
    });
  }
}
