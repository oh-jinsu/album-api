import { Injectable } from "@nestjs/common";
import {
  RemovePropertyParam,
  ReplacePropertyParam,
} from "src/core/types/params/update";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { ImageProvider } from "src/declarations/providers/image";
import { UserRepository } from "src/declarations/repositories/user";

export type UpdateNameDto = {
  path: "/name";
} & ReplacePropertyParam<string>;

export type UpdateEmailDto = {
  path: "/email";
} & (ReplacePropertyParam<string> | RemovePropertyParam);

export type UpdateAvatarDto = {
  path: "/avatar_id";
} & (ReplacePropertyParam<string> | RemovePropertyParam);

export type UpdateMeDto = UpdateNameDto | UpdateEmailDto | UpdateAvatarDto;

export interface Params {
  accessToken: string;
  dtos: UpdateMeDto[];
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
    { dtos }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const option = await this.userRepository.findOne(userId);

    if (option.isNone()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    await Promise.all(
      dtos.map((dto) => {
        if (dto.path == "/name") {
          return this.userRepository.update(userId, {
            name: dto.value,
          });
        }

        if (dto.path == "/email") {
          if (dto.op == "remove") {
            return this.userRepository.update(userId, {
              email: null,
            });
          } else {
            return this.userRepository.update(userId, {
              email: dto.value,
            });
          }
        }

        if (dto.path === "/avatar_id") {
          if (dto.op == "remove") {
            return this.userRepository.update(userId, {
              avatar: null,
            });
          } else {
            return this.userRepository.update(userId, {
              avatar: dto.value,
            });
          }
        }
      }),
    );

    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    const user = userOption.value;

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
