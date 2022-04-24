import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isProduction } from "src/core/environment";
import { Claim } from "src/declarations/models/claim";
import {
  AuthProvider,
  IssueTokenOptions,
} from "src/declarations/providers/auth";

@Injectable()
export class AuthProviderImpl implements AuthProvider {
  constructor(private readonly jwtService: JwtService) {}

  async issueAccessToken({ sub }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
        expiresIn: isProduction
          ? process.env.JWT_EXPIRES_IN_ACCESS_TOKEN
          : process.env.JWT_EXPIRES_IN_ACCESS_TOKEN_FOR_DEV,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      });

      return true;
    } catch {
      return false;
    }
  }

  async issueRefreshToken({ sub }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
        expiresIn: isProduction
          ? process.env.JWT_EXPIRES_IN_REFRESH_TOKEN
          : process.env.JWT_EXPIRES_IN_REFRESH_TOKEN_FOR_DEV,
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      });

      return true;
    } catch {
      return false;
    }
  }

  async extractClaim(token: string): Promise<Claim> {
    const { sub } = this.jwtService.decode(token);

    return new Claim({ id: sub });
  }
}
