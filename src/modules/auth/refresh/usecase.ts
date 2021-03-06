import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { HashProvider } from "src/declarations/providers/hash";
import { AuthRepository } from "src/declarations/repositories/auth";

export interface Params {
  refreshToken: string;
}

export interface Result {
  accessToken: string;
}

@Injectable()
export class RefreshAuthUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute({ refreshToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyRefreshToken(refreshToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id, grade } = await this.authProvider.extractClaim(refreshToken);

    const option = await this.authRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(2, "탈퇴한 이용자입니다.");
    }

    const auth = option.value;

    if (
      !auth.refreshToken ||
      !(await this.hashProvider.compare(refreshToken, auth.refreshToken))
    ) {
      return new UseCaseException(3, "폐기된 인증정보입니다.");
    }

    const oldone = auth.accessToken;

    const isNotExpired = await this.authProvider.verifyAccessToken(oldone);

    const accessToken = isNotExpired
      ? oldone
      : await this.authProvider.issueAccessToken({
          sub: id,
          grade,
        });

    if (accessToken !== oldone) {
      await this.authRepository.update(id, { accessToken });
    }

    return new UseCaseOk({
      accessToken,
    });
  }
}
