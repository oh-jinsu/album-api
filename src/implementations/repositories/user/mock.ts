import { Option } from "src/core/types/option";
import { UserModel } from "src/declarations/models/user";
import {
  SaveUserDto,
  UpdateUserDto,
  UserRepository,
} from "src/declarations/repositories/user";

export class MockUserRepository implements UserRepository {
  find = jest.fn<Promise<UserModel[]>, []>();

  findOne = jest.fn<Promise<Option<UserModel>>, [string]>();

  save = jest.fn<Promise<UserModel>, [SaveUserDto]>();

  update = jest.fn<Promise<UserModel>, [string, UpdateUserDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
