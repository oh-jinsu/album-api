import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/enums/results/usecase";
import { UseCase } from "src/core/usecase";
import { FilmRepository } from "src/declarations/repositories/film";
import { UserRepository } from "src/declarations/repositories/user";

export type Params = Record<string, never>;

export type Result = Record<string, never>;

@Injectable()
export class PresentFilmsUseCase implements UseCase<Params, Result> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filmRepository: FilmRepository,
  ) {}

  async execute(): Promise<UseCaseResult<Result>> {
    const users = await this.userRepository.find();

    await Promise.all(users.map(({ id }) => this.filmRepository.save(id)));

    return new UseCaseOk({});
  }
}
