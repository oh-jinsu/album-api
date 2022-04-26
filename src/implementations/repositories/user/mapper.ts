import { UserModel } from "src/declarations/models/user";
import { UserEntity } from "./entity";

export class UserMapper {
  static toModel({
    id,
    email,
    avatar,
    refreshToken,
    updatedAt,
    createdAt,
  }: UserEntity): UserModel {
    return new UserModel({
      id,
      email,
      avatar,
      refreshToken,
      updatedAt,
      createdAt,
    });
  }
}
