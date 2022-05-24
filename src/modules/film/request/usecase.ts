import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/enums/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { FilmRepository } from "src/declarations/repositories/film";

export interface Params {
  accessToken: string;
  productId: string;
  source: "google_play" | "app_store";
  token: string;
}

export interface Result {
  count: number;
}

@Injectable()
export class RequestFilmUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly appleAuthProvider: AppleAuthProvider,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly filmRepository: FilmRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { source, token }: Omit<Params, "accessToken">,
  ): Promise<UseCaseResult<Result>> {
    const transaction = await (() => {
      switch (source) {
        case "google_play":
          return this.googleAuthProvider.findTransaction(token);
        case "app_store":
          return this.appleAuthProvider.findTransaction(token);
      }
    })();

    const amount = (() => {
      switch (transaction.productId) {
        case "10film":
          return 10;
        case "25film":
          return 25;
        case "50film":
          return 50;
        case "100film":
          return 100;
        default:
          return 0;
      }
    })();

    for (let i = 0; i < amount; i++) {
      await this.filmRepository.save(userId);
    }

    const current = await this.filmRepository.countByUserId(userId);

    return new UseCaseOk({
      count: current + amount,
    });
  }
}
