import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { FilmRepository } from "src/declarations/repositories/film";

export interface Params {
  accessToken: string;
}

export interface Result {
  count: number;
}

@Injectable()
export class CountMyFilmUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly filmRepository: FilmRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    const count = await this.filmRepository.countByUserId(id);

    return new UseCaseOk({
      count,
    });
  }
}
