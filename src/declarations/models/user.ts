export class UserModel {
  public readonly id: string;
  public readonly name: string;
  public readonly email?: string;
  public readonly avatar?: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    email,
    name,
    avatar,
    updatedAt,
    createdAt,
  }: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    updatedAt: Date;
    createdAt: Date;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
