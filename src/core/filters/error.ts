import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { isProduction } from "../environment";

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    response.status(500).json({
      code: 1000,
      message: isProduction ? "예기치 못한 오류입니다." : exception.message,
    });
  }
}
