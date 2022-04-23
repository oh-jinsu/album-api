import {
  AuthProvider,
  IssueTokenOptions,
} from "src/declarations/providers/auth";

export class MockAuthProvider implements AuthProvider {
  issueAccessToken = jest.fn<Promise<string>, [IssueTokenOptions]>();

  issueRefreshToken = jest.fn<Promise<string>, [IssueTokenOptions]>();
}
