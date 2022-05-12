import { ClaimGrade, ClaimModel } from "../models/claim";
import { InvitationClaimModel } from "../models/invitation_claim";

export type IssueTokenOptions = {
  sub: string;
  grade: ClaimGrade;
};

export type IssueInvitationTokenOptions = {
  sub: string;
};

export abstract class AuthProvider {
  abstract issueAccessToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyAccessToken(token: string): Promise<boolean>;

  abstract issueRefreshToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<boolean>;

  abstract extractClaim(token: string): Promise<ClaimModel>;

  abstract issueInvitationToken(
    option: IssueInvitationTokenOptions,
  ): Promise<string>;

  abstract verifyInvitationToken(token: string): Promise<boolean>;

  abstract extractInvitationClaim(token: string): Promise<InvitationClaimModel>;
}
