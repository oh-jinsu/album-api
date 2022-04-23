export abstract class AuthProvider {
  abstract issueAccessToken(option: {
    sub: string;
    expiration: number;
  }): Promise<string>;

  abstract issueRefreshToken(option: {
    sub: string;
    expiration: number;
  }): Promise<string>;
}
