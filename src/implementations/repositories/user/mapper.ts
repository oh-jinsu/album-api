import { UserModel } from 'src/declarations/models/user';
import { UserEntity } from './entity';

export class UserMapper {
  static toModel({
    id,
    email,
    refreshToken,
    updatedAt,
    createdAt,
  }: UserEntity): UserModel {
    return new UserModel({
      id,
      email,
      refreshToken,
      updatedAt,
      createdAt,
    });
  }
}
