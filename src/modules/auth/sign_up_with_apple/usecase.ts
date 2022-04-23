import { Injectable } from "@nestjs/common";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/core/enums/results/usecase";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  idToken: string;
}

export interface Result {
  id: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class SignUpWithAppleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly appleAuthProvider: AppleAuthProvider,
  ) {}

  async execute({ idToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerified = await this.appleAuthProvider.verify(idToken);

    if (!isVerified) {
      return new UseCaseException(1, "유효하지 않은 인증정보입니다.");
    }

    const { id, email } = await this.appleAuthProvider.extractClaim(idToken);

    const option = await this.userRepository.findById(id);

    if (option.isSome()) {
      return new UseCaseException(2, "이미 가입한 이용자입니다.");
    }

    const user = await this.userRepository.save({ id, email });

    return new UseCaseOk({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
