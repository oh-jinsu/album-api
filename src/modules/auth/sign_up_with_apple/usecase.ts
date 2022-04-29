import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { HashProvider } from "src/declarations/providers/hash";
import { AuthRepository } from "src/declarations/repositories/auth";

export interface Params {
  idToken: string;
}

export interface Result {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class SignUpWithAppleUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute({ idToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.appleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id: key } = await this.appleAuthProvider.extractClaim(idToken);

    const option = await this.authRepository.findOneByKey(key);

    if (option.isSome()) {
      return new UseCaseException(2, "이미 가입한 이용자입니다.");
    }

    const { id } = await this.authRepository.save({
      key,
      from: "apple",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
    });

    await this.authRepository.updateAccessToken(id, accessToken);

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.updateRefreshToken(id, hashedRefreshToken);

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
