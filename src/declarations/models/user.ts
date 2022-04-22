export class UserModel {
  public readonly id: string;
  public readonly email: string;
  public readonly refreshToken?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    email,
    refreshToken,
    updatedAt,
    createdAt,
  }: {
    id: string;
    email: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.email = email;
    this.refreshToken = refreshToken;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
