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
      return Adapter.mapSnakeCase(result.value);
    }

    throw Error();
  }

  private static mapSnakeCase(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map(Adapter.mapSnakeCase);
    }

    if (value.constructor === Object) {
      const result = {};

      Object.entries(value).forEach(([key, value]) => {
        const mappedKey = key.replace(/[A-Z]/, (substring) => {
          return `_${substring.toLowerCase()}`;
        });

        result[mappedKey] = Adapter.mapSnakeCase(value);
      });

      return result;
    }

    return value;
  }

  abstract getExceptionStatus(code: number): number;
}
