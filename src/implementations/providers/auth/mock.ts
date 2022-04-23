import { AuthProvider } from "src/declarations/providers/auth";

export class MockAuthProvider implements AuthProvider {
  issueAccessToken = jest.fn<
    Promise<string>,
    [
      {
        sub: string;
        expiration: number;
      },
    ]
  >();

  issueRefreshToken = jest.fn<
    Promise<string>,
    [
      {
        sub: string;
        expiration: number;
      },
    ]
  >();
}
