import { Option } from "src/core/enums/option";
import { AuthModel } from "src/declarations/models/auth";
import {
  AuthRepository,
  SaveAuthDto,
} from "src/declarations/repositories/auth";

export class MockAuthRepository implements AuthRepository {
  findOne = jest.fn<Promise<Option<AuthModel>>, [string]>();

  findOneByKey = jest.fn<Promise<Option<AuthModel>>, [string]>();

  save = jest.fn<Promise<AuthModel>, [SaveAuthDto]>();

  updateAccessToken = jest.fn<Promise<AuthModel>, [string, string]>();

  updateRefreshToken = jest.fn<Promise<AuthModel>, [string, string]>();

  delete = jest.fn<Promise<void>, [string]>();
}
