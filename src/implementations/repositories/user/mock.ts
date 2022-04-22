import { Option, Some } from 'src/core/option';
import { RepositoryOk, RepositoryResult } from 'src/core/results/repository';
import { UserModel } from 'src/declarations/models/user';
import { UserRepository } from 'src/declarations/repositories/user';

export class MockUserRepository implements UserRepository {
  async find(): Promise<RepositoryResult<Option<UserModel>>> {
    return new RepositoryOk(
      new Some(new UserModel({ id: 1, email: 'an email' })),
    );
  }

  async findByEmail(
    email: string,
  ): Promise<RepositoryResult<Option<UserModel>>> {
    return new RepositoryOk(new Some(new UserModel({ id: 1, email: email })));
  }

  async save(email: string): Promise<RepositoryResult<UserModel>> {
    return new RepositoryOk(new UserModel({ id: 1, email: email }));
  }
}
