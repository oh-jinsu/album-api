export interface Option<T = any> {
  isSome: () => this is Some<T>;
  isNone: () => this is None;
}

export class Some<T = any> implements Option<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isNone(): this is None {
    return false;
  }

  isSome(): this is Some<T> {
    return true;
  }
}

export class None implements Option {
  isNone(): this is None {
    return true;
  }

  isSome(): this is Some {
    return false;
  }
}
