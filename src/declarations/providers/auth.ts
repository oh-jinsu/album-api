import { Claim } from "../models/claim";

export type IssueTokenOptions = {
  sub: string;
  expiration: number;
};

export abstract class AuthProvider {
  abstract issueAccessToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyAccessToken(token: string): Promise<boolean>;

  abstract issueRefreshToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<boolean>;

  abstract extractClaim(token: string): Promise<Claim>;
}
