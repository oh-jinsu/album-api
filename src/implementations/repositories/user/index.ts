import { Option } from 'src/core/option';
import { RepositoryResult } from 'src/core/results/repository';
import { UserModel } from 'src/declarations/models/user';
import { UserRepository } from 'src/declarations/repositories/user';

export class UserRepositoryImpl implements UserRepository {
  async find(): Promise<RepositoryResult<Option<UserModel>>> {
    throw Error('Unimplemented');
  }

  async findByEmail(
    email: string,
  ): Promise<RepositoryResult<Option<UserModel>>> {
    throw Error('Unimplemented');
  }

  async save(email: string): Promise<RepositoryResult<UserModel>> {
    throw Error('Unimplemented');
  }
}
