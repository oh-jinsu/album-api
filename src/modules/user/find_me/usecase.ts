import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
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
export class FindMeUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
    private readonly imageProvider: ImageProvider,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    const { email, name, avatar, updatedAt, createdAt } = option.value;

    const avatarImageUri = avatar
      ? await this.imageProvider.getPublicImageUri(avatar)
      : null;

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
