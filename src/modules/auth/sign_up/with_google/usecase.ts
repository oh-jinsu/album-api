import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { HashProvider } from "src/declarations/providers/hash";
import { AuthRepository } from "src/declarations/repositories/auth";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
  idToken: string;
}

export interface Result {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class SignUpWithGoogleUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(authProvider);
  }

  protected isOpenFor(grade: ClaimGrade): boolean {
    return grade === "guest";
  }

  protected async executeWithAuth(
    { id }: ClaimModel,
    { idToken }: Params,
  ): Promise<UseCaseResult<Result>> {
    const isVerified = await this.googleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id: key } = await this.googleAuthProvider.extractClaim(idToken);

    const option = await this.authRepository.findOneByKey(key);

    if (option.isSome()) {
      return new UseCaseException(2, "이미 가입한 이용자입니다.");
    }

    await this.authRepository.update(id, {
      key,
      from: "google",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
      grade: "member",
    });

    await this.authRepository.update(id, { accessToken });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
      grade: "member",
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(id, { refreshToken: hashedRefreshToken });

    await this.userRepository.delete(id);

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
