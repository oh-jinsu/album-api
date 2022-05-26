import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimGrade, ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { FilmRepository } from "src/declarations/repositories/film";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
}

export interface Result {
  id: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}

@Injectable()
export class CreateGuestUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly userRepository: UserRepository,
    private readonly filmRepository: FilmRepository,
  ) {
    super(authProvider);
  }

  protected assertGrade(grade: ClaimGrade): boolean {
    return grade === "guest";
  }

  protected async executeWithAuth({
    id,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    const option = await this.userRepository.findOne(id);

    if (!option.isNone()) {
      return new UseCaseException(1, "이미 등록된 이용자입니다.");
    }

    const { name, updatedAt, createdAt } = await this.userRepository.save({
      id,
      name: "게스트",
    });

    for (let i = 0; i < 3; i++) {
      this.filmRepository.save(id);
    }

    return new UseCaseOk({
      id,
      name,
      updatedAt,
      createdAt,
    });
  }
}
