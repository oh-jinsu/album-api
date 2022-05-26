import { Injectable } from "@nestjs/common";
import { UseCaseOk, UseCaseResult } from "src/core/types/results/usecase";
import { AuthorizedUseCase } from "src/core/usecase/authorized";
import { ClaimModel } from "src/declarations/models/claim";
import { AuthProvider } from "src/declarations/providers/auth";
import { AuthRepository } from "src/declarations/repositories/auth";
import { FriendRepository } from "src/declarations/repositories/friend";
import { UserRepository } from "src/declarations/repositories/user";

export interface Params {
  accessToken: string;
}

export type Result = Record<string, never>;

@Injectable()
export class DeleteAuthUseCase extends AuthorizedUseCase<Params, Result> {
  constructor(
    authProvider: AuthProvider,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly friendRepository: FriendRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth({
    id: userId,
  }: ClaimModel): Promise<UseCaseResult<Result>> {
    await this.authRepository.delete(userId);

    await this.userRepository.delete(userId);

    const { items: friends } = await this.friendRepository.findByUserId(userId);

    await Promise.all(
      friends.map(({ id }) => {
        return this.friendRepository.delete(id);
      }),
    );

    return new UseCaseOk(null);
  }
}
