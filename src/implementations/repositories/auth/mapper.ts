import { AuthModel } from "src/declarations/models/auth";
import { AuthEntity } from "./entity";

export class AuthMapper {
  static toModel({
    id,
    key,
    from,
    accessToken,
    refreshToken,
    updatedAt,
    createdAt,
  }: AuthEntity): AuthModel {
    return new AuthModel({
      id,
      key,
      from,
      accessToken,
      refreshToken,
      updatedAt,
      createdAt,
    });
  }
}
