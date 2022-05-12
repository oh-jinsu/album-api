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
        this.status(result.code),
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
        const mappedKey = key.replace(/[A-Z]/g, (substring) => {
          return `_${substring.toLowerCase()}`;
        });

        result[mappedKey] = Adapter.mapSnakeCase(value);
      });

      return result;
    }

    return value;
  }

  private status(code: number): number {
    switch (code) {
      case 102:
        return 401;
      case 104:
        return 403;
      default:
        return this.getExceptionStatus(code);
    }
  }

  protected abstract getExceptionStatus(code: number): number;
}
