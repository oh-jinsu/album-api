import { Option } from 'src/core/option';
import { RepositoryResult } from 'src/core/results/repository';
import { UserModel } from 'src/declarations/models/user';

export abstract class UserRepository {
  abstract find(): Promise<RepositoryResult<UserModel[]>>;

  abstract findByEmail(
    key: string,
  ): Promise<RepositoryResult<Option<UserModel>>>;

  abstract save(email: string): Promise<RepositoryResult<UserModel>>;
}
