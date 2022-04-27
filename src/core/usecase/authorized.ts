import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { UseCase } from ".";
import { UseCaseException, UseCaseResult } from "../enums/results/usecase";

export interface AuthorizedUseCaseParams {
  accessToken: string;
}

export abstract class AuthorizedUseCase<T extends AuthorizedUseCaseParams, K>
  implements UseCase<T, K>
{
  constructor(private readonly authProvider: AuthProvider) {}

  async execute({ accessToken, ...params }: T): Promise<UseCaseResult<K>> {
    const isVerified = await this.authProvider.verifyAccessToken(accessToken);

    if (!isVerified) {
      return new UseCaseException(102, "유효하지 않은 인증정보입니다.");
    }

    const claim = await this.authProvider.extractClaim(accessToken);

    return this.executeWithAuth(claim, params);
  }

  protected abstract executeWithAuth(
    claim: ClaimModel,
    params: Omit<T, "accessToken">,
  ): Promise<UseCaseResult<K>>;
}
