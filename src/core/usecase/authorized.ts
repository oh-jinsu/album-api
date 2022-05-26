import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { UseCase } from ".";
import { UseCaseException, UseCaseResult } from "../types/results/usecase";

export interface AuthorizedUseCaseParams {
  accessToken: string;
}

export abstract class AuthorizedUseCase<T extends AuthorizedUseCaseParams, K>
  implements UseCase<T, K>
{
  constructor(protected readonly authProvider: AuthProvider) {}

  async execute({ accessToken, ...params }: T): Promise<UseCaseResult<K>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(102, "유효하지 않은 인증정보입니다.");
    }

    const claim = await this.authProvider.extractClaim(accessToken);

    if (!this.assertGrade(claim.grade)) {
      return new UseCaseException(104, "권한이 없습니다.");
    }

    return this.executeWithAuth(claim, params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected assertGrade(grade: ClaimGrade): boolean {
    return true;
  }

  protected abstract executeWithAuth(
    claim: ClaimModel,
    params: Omit<T, "accessToken">,
  ): Promise<UseCaseResult<K>>;
}
