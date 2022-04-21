export interface RepositoryResult<T = any> {
  isOk: () => this is RepositoryOk<T>;
  isError: () => this is RepositoryError;
}

export class RepositoryOk<T = any> implements RepositoryResult<T> {
  public readonly value: any;

  constructor(value: any) {
    this.value = value;
  }

  isOk(): this is RepositoryOk<T> {
    return true;
  }

  isError(): this is RepositoryError {
    return false;
  }
}

export class RepositoryError implements RepositoryResult {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }

  isOk(): this is RepositoryOk {
    return false;
  }

  isError(): this is RepositoryError {
    return true;
  }
}
