export type IssueTokenOptions = {
  sub: string;
  expiration: number;
};

export abstract class AuthProvider {
  abstract issueAccessToken(option: IssueTokenOptions): Promise<string>;

  abstract issueRefreshToken(option: IssueTokenOptions): Promise<string>;
}
