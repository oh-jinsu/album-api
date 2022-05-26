import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/types/results/usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { HashProvider } from "src/declarations/providers/hash";
import { AuthRepository } from "src/declarations/repositories/auth";

export type Params = Record<string, never>;

export interface Result {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class IssueGuestTokenUseCase {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly hashProvider: HashProvider,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(): Promise<UseCaseResult<Result>> {
    const { id } = await this.authRepository.save({
      key: "none",
      from: "guest",
    });

    const accessToken = await this.authProvider.issueAccessToken({
      sub: id,
      grade: "guest",
    });

    await this.authRepository.update(id, {
      accessToken,
    });

    const refreshToken = await this.authProvider.issueRefreshToken({
      sub: id,
      grade: "guest",
    });

    const hashedRefreshToken = await this.hashProvider.encode(refreshToken);

    await this.authRepository.update(id, {
      refreshToken: hashedRefreshToken,
    });

    return new UseCaseOk({
      accessToken,
      refreshToken,
    });
  }
}
