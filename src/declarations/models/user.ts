export class UserModel {
  public readonly id: string;
  public readonly email: string;
  public readonly avatar: string;
  public readonly refreshToken?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    email,
    avatar,
    refreshToken,
    updatedAt,
    createdAt,
  }: {
    id: string;
    email: string;
    avatar: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.email = email;
    this.avatar = avatar;
    this.refreshToken = refreshToken;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
