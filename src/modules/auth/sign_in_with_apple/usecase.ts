import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { HashProvider } from "src/declarations/providers/hash";
import { UserRepository } from "src/declarations/repositories/user";

interface Params {
  idToken: string;
}

interface Result {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class SignInWithAppleUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ idToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.appleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id } = await this.appleAuthProvider.extractClaim(idToken);

    const option = await this.userRepository.findOneByFrom(id);

    if (!option.isSome()) {
      return new UseCaseException(2, "가입하지 않은 이용자입니다.");
    }

    const { id: userId } = option.value;

    const accessToken = await this.authProvider.issueAccessToken({
      sub: userId,
    });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: userId,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
