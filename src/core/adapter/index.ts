import { HttpException } from "@nestjs/common";
import { UseCaseResult } from "src/core/enums/results/usecase";

export abstract class Adapter {
  response<T>(result: UseCaseResult<T>): { [key: string]: any } {
    if (result.isException()) {
      const { code, message } = result;

      throw new HttpException(
        {
          code,
          message,
        },
        this.getExceptionStatus(result.code),
      );
    }

    if (result.isOk()) {
      return Adapter.map(result.value);
    }

    throw Error();
  }

  private static map(value: any): { [key: string]: any } {
    const result = {};

    Object.entries(value).forEach(([key, value]) => {
      const mappedKey = key.replace(/[A-Z]/, (substring) => {
        return `_${substring.toLowerCase()}`;
      });

      result[mappedKey] = value;
    });

    return result;
  }

  abstract getExceptionStatus(code: number): number;
}
