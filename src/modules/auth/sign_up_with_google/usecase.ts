import { Injectable } from '@nestjs/common';
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from 'src/core/results/usecase';
import { GoogleAuthProvider } from 'src/declarations/providers/google_auth';
import { UserRepository } from 'src/declarations/repositories/user';

export interface Params {
  idToken: string;
}

export interface Result {
  id: number;
  email: string;
  createdAt: Date;
}

@Injectable()
export class SignUpWithGoogleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly googleAuthProvider: GoogleAuthProvider,
  ) {}

  async execute({ idToken }: Params): Promise<UseCaseResult<Result>> {
    const isVerifiedResult = await this.googleAuthProvider.verify(idToken);

    if (isVerifiedResult.isError()) {
      return new UseCaseException(1, '유효하지 않은 인증정보입니다.');
    }

    const resultForEmail = await this.googleAuthProvider.extractEmail(idToken);

    if (!resultForEmail.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    const email = resultForEmail.value;

    const existenceResult = await this.userRepository.findByEmail(email);

    if (!existenceResult.isOk()) {
      return new UseCaseException(1000, '예기치 못한 오류입니다.');
    }

    const exists = existenceResult.value;

    if (exists.isSome()) {
      return new UseCaseException(2, '이미 가입한 이용자입니다.');
    }

    const userResult = await this.userRepository.save(email);

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
