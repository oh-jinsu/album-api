import { ClaimModel } from "src/declarations/models/claim";
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

  extractClaim = jest.fn<Promise<ClaimModel>, [string]>();
}
