import { UserModel } from "src/declarations/models/user";
import { UserEntity } from "./entity";

export class UserMapper {
  static toModel({
    id,
    from,
    name,
    email,
    avatar,
    refreshToken,
    updatedAt,
    createdAt,
  }: UserEntity): UserModel {
    return new UserModel({
      id,
      from,
      name,
      email,
      avatar,
      refreshToken,
      updatedAt,
      createdAt,
    });
  }
}
