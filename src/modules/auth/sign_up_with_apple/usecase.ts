import { Injectable } from '@nestjs/common';
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from 'src/core/enums/results/usecase';
import { AppleAuthProvider } from 'src/declarations/providers/apple_auth';
import { UserRepository } from 'src/declarations/repositories/user';

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
    const isVerifiedResult = await this.appleAuthProvider.verify(idToken);

    if (!isVerifiedResult.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    if (!isVerifiedResult.value) {
      return new UseCaseException(1, '유효하지 않은 인증정보입니다.');
    }

    const resultForClaim = await this.appleAuthProvider.extractClaim(idToken);

    if (!resultForClaim.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    const { id, email } = resultForClaim.value;

    const existenceResult = await this.userRepository.findById(id);

    if (!existenceResult.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    const exists = existenceResult.value;

    if (exists.isSome()) {
      return new UseCaseException(2, '이미 가입한 이용자입니다.');
    }

    const userResult = await this.userRepository.save({ id, email });

    if (!userResult.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    const user = userResult.value;

    return new UseCaseOk({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
