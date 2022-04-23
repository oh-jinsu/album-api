import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  AuthProvider,
  IssueTokenOptions,
} from "src/declarations/providers/auth";

@Injectable()
export class AuthProviderImpl implements AuthProvider {
  constructor(private readonly jwtService: JwtService) {}

  async issueAccessToken({
    sub,
    expiration,
  }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
        expiresIn: expiration,
      },
    );
  }

  async issueRefreshToken({
    sub,
    expiration,
  }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
        expiresIn: expiration,
      },
    );
  }
}
