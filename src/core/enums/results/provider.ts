export interface ProviderResult<T = any> {
  isOk: () => this is ProviderOk<T>;
  isError: () => this is ProviderError;
}

export class ProviderOk<T = any> implements ProviderResult<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is ProviderOk<T> {
    return true;
  }

  isError(): this is ProviderError {
    return false;
  }
}

export class ProviderError implements ProviderResult {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }

  isOk(): this is ProviderOk {
    return false;
  }

  isError(): this is ProviderError {
    return true;
  }
}
