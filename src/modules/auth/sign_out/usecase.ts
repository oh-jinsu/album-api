import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { AuthRepository } from "src/declarations/repositories/auth";

export interface Params {
  accessToken: string;
}

export type Result = Record<string, never>;

@Injectable()
export class SignOutUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly authRepository: AuthRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    const option = await this.authRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(1, "가입자를 찾지 못했습니다.");
    }

    const { refreshToken } = option.value;

    if (!refreshToken) {
      return new UseCaseException(2, "이미 로그아웃했습니다.");
    }

    await this.authRepository.updateAccessToken(id, null);

    await this.authRepository.updateRefreshToken(id, null);

    return new UseCaseOk(null);
  }
}
