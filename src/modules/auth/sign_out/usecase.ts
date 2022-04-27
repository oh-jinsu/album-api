import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
}

export type Result = Record<string, never>;

@Injectable()
export class SignOutUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id: userId,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    const option = await this.userRepository.findOne(userId);

    if (!option.isSome()) {
      return new UseCaseException(1, "이용자를 찾지 못했습니다.");
    }

    const { refreshToken } = option.value;

    if (!refreshToken) {
      return new UseCaseException(2, "이미 로그아웃한 이용자입니다.");
    }

    await this.userRepository.update(userId, {
      refreshToken: null,
    });

    return new UseCaseOk(null);
  }
}
