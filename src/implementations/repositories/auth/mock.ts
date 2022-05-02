import { Option } from "src/core/enums/option";
import { AuthModel } from "src/declarations/models/auth";
import {
  AuthRepository,
  SaveAuthDto,
  UpdateAuthDto,
} from "src/declarations/repositories/auth";

export class MockAuthRepository implements AuthRepository {
  findOne = jest.fn<Promise<Option<AuthModel>>, [string]>();

  findOneByKey = jest.fn<Promise<Option<AuthModel>>, [string]>();

  save = jest.fn<Promise<AuthModel>, [SaveAuthDto]>();

  update = jest.fn<Promise<AuthModel>, [string, UpdateAuthDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
