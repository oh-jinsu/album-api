import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
}

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ accessToken }: Params): Promise<UseCaseResult<void>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id } = await this.authProvider.extractClaim(accessToken);

    const option = await this.userRepository.findOne(id);

    if (!option.isSome()) {
      return new UseCaseException(2, "이용자를 찾지 못했습니다.");
    }

    const { refreshToken } = option.value;

    if (!refreshToken) {
      return new UseCaseException(3, "이미 로그아웃한 이용자입니다.");
    }

    await this.userRepository.update(id, {
      refreshToken: null,
    });

    return new UseCaseOk(null);
  }
}
