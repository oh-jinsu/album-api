import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    response.status(status).json(this.getBody(exception));
  }

  private getBody(exception: HttpException): { [key: string]: any } {
    const status = exception.getStatus();

    const response = exception.getResponse();

    if (typeof response === "string") {
      return {
        message: response,
      };
    }

    if ("code" in response && "message" in response) {
      return response;
    }

    if (status === 404) {
      return {
        code: 100,
        message: "종단점을 찾지 못했습니다.",
      };
    }

    if (status === 400) {
      return {
        code: 101,
        message: "유효하지 않은 요청입니다.",
      };
    }

    return {
      code: 1001,
      message: "서비스가 일시적으로 작동하지 않습니다.",
    };
  }
}
