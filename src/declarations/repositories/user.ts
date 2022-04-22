import { Option } from 'src/core/enums/option';
import { RepositoryResult } from 'src/core/enums/results/repository';
import { UserModel } from 'src/declarations/models/user';

export abstract class UserRepository {
  abstract find(): Promise<RepositoryResult<UserModel[]>>;

  abstract findById(key: string): Promise<RepositoryResult<Option<UserModel>>>;

  abstract save(dto: {
    id: string;
    email?: string;
  }): Promise<RepositoryResult<UserModel>>;
}
