import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  name?: string;
  email?: string;
  avatarId?: string;
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
export class UpdateMeUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
    private readonly imageProvider: ImageProvider,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "member";
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { name, email, avatarId }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const userOption = await this.userRepository.findOne(userId);

    if (userOption.isNone()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    const user = await this.userRepository.update(userId, {
      name,
      email,
      avatar: avatarId,
    });

    const avatarImageUri = user.avatar
      ? await this.imageProvider.getPublicImageUri(user.avatar)
      : null;

    return new UseCaseOk({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarImageUri,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    });
  }
}
