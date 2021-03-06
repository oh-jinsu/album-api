import { ClaimModel } from "src/declarations/models/claim";
import { InvitationClaimModel } from "src/declarations/models/invitation_claim";
import {
  AuthProvider,
  IssueInvitationTokenOptions,
  IssueTokenOptions,
} from "src/declarations/providers/auth";

export class MockAuthProvider implements AuthProvider {
  issueAccessToken = jest.fn<Promise<string>, [IssueTokenOptions]>();

  verifyAccessToken = jest.fn<Promise<boolean>, [string]>();

  issueRefreshToken = jest.fn<Promise<string>, [IssueTokenOptions]>();

  verifyRefreshToken = jest.fn<Promise<boolean>, [string]>();

  issueInvitationToken = jest.fn<
    Promise<string>,
    [IssueInvitationTokenOptions]
  >();

  verifyInvitationToken = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<ClaimModel>, [string]>();

  extractInvitationClaim = jest.fn<Promise<InvitationClaimModel>, [string]>();
}
