import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Response } from "express";

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    response.status(429).json({
      code: 103,
      message: "너무 많은 요청을 보내고 있습니다.",
    });
  }
}
