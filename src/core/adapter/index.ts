import { HttpException } from '@nestjs/common';
import { UseCaseException, UseCaseResult } from '../results/usecase';

export abstract class Adapter {
  response(result: UseCaseResult) {
    if (result.isException()) {
      return this.responseException(result);
    }

    if (result.isOk()) {
      return result.value;
    }

    throw Error();
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
