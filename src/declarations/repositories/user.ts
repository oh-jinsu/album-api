import { Option } from 'src/core/option';
import { RepositoryResult } from 'src/core/results/repository';
import { UserModel } from 'src/declarations/models/user';

export interface UserRepository {
  find: () => Promise<RepositoryResult<Option<UserModel>>>;
  findByEmail: (email: string) => Promise<RepositoryResult<Option<UserModel>>>;
  save: (email: string) => Promise<RepositoryResult<UserModel>>;
}
