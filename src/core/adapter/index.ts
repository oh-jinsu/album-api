import { HttpException } from '@nestjs/common';
import {
  UseCaseException,
  UseCaseResult,
} from 'src/core/enums/results/usecase';

export abstract class Adapter {
  response<T>(result: UseCaseResult<T>) {
    if (result.isException()) {
      return this.responseException(result);
    }

    if (result.isOk()) {
      return Adapter.map(result.value);
    }

    throw Error();
  }

  private static map(value: any) {
    const result = {};

    Object.entries(value).forEach(([key, value]) => {
      const mappedKey = key.replace(/[A-Z]/, (substring) => {
        return `_${substring.toLowerCase()}`;
      });

      result[mappedKey] = value;
    });

    return result;
  }

  responseException(result: UseCaseException) {
    const { code, message } = result;

    throw new HttpException(
      {
        code,
        message,
      },
      this.getExceptionStatus(result.code),
    );
  }

  abstract getExceptionStatus(code: number);
}
