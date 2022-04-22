export interface UseCaseResult<T = any> {
  isOk: () => this is UseCaseOk<T>;
  isException: () => this is UseCaseException;
}

export class UseCaseOk<T = any> implements UseCaseResult<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is UseCaseOk<T> {
    return true;
  }

  isException(): this is UseCaseException {
    return false;
  }
}

export class UseCaseException implements UseCaseResult {
  public readonly code: number;
  public readonly message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  isOk(): this is UseCaseOk {
    return false;
  }

  isException(): this is UseCaseException {
    return true;
  }
}
