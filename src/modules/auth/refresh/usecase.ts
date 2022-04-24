import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { HashProvider } from "src/declarations/providers/hash";
import { UserRepository } from "src/declarations/repositories/user";

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
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ refreshToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.authProvider.verifyRefreshToken(refreshToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id } = await this.authProvider.extractClaim(refreshToken);

    const option = await this.userRepository.findById(id);

    if (!option.isSome()) {
      return new UseCaseException(2, "탈퇴한 이용자입니다.");
    }

    const user = option.value;

    if (
      !user.refreshToken ||
      !(await this.hashProvider.compare(refreshToken, user.refreshToken))
    ) {
      return new UseCaseException(3, "폐기된 인증정보입니다.");
    }

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
      expiration: 1000 * 60 * 1,
    });

    return new UseCaseOk({
      accessToken,
    });
  }
}
