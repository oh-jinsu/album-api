export class UserModel {
  public readonly id: string;
  public readonly from: string;
  public readonly name: string;
  public readonly email: string;
  public readonly avatar: string;
  public readonly refreshToken?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    email,
    from,
    name,
    avatar,
    refreshToken,
    updatedAt,
    createdAt,
  }: {
    id: string;
    email: string;
    name: string;
    from: string;
    avatar: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.from = from;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.refreshToken = refreshToken;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
