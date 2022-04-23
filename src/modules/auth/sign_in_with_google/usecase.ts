import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
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
export class SignInWithGoogleUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ idToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.googleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id } = await this.googleAuthProvider.extractClaim(idToken);

    const option = await this.userRepository.findById(id);

    if (!option.isSome()) {
      return new UseCaseException(2, "가입하지 않은 이용자입니다.");
    }

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
      expiration: 1000 * 60 * 1,
    });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
      expiration: 1000 * 60 * 60 * 24 * 365,
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.userRepository.update(id, { refreshToken: hashedRefreshToken });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
