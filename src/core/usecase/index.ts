import { UseCaseResult } from "../enums/results/usecase";

export abstract class UseCase<T, K> {
  abstract execute(params: T): Promise<UseCaseResult<K>>;
}
