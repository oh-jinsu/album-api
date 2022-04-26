import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { Request } from "express";

export const AccessToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest<Request>();

      const bearerToken = request.headers.authorization;

      return bearerToken.trim().replace("Bearer ", "");
    } catch {
      throw new BadRequestException();
    }
  },
);
