export class AuthModel {
  public readonly id: string;
  public readonly key: string;
  public readonly from: string;
  public readonly accessToken?: string;
  public readonly refreshToken?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    key,
    from,
    accessToken,
    refreshToken,
    updatedAt,
    createdAt,
  }: {
    id: string;
    key: string;
    from: string;
    accessToken?: string;
    refreshToken?: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.key = key;
    this.from = from;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
