import { UserModel } from "src/declarations/models/user";
import { UserEntity } from "./entity";

export class UserMapper {
  static toModel({
    id,
    name,
    email,
    avatar,
    updatedAt,
    createdAt,
  }: UserEntity): UserModel {
    return new UserModel({
      id,
      name,
      email,
      avatar,
      updatedAt,
      createdAt,
    });
  }
}
