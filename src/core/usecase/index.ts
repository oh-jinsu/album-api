import { UseCaseResult } from "../types/results/usecase";

export abstract class UseCase<T, K> {
  abstract execute(params: T): Promise<UseCaseResult<K>>;
}
