import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { None, Option, Some } from 'src/core/enums/option';
import {
  RepositoryOk,
  RepositoryResult,
} from 'src/core/enums/results/repository';
import { UserModel } from 'src/declarations/models/user';
import { UserRepository } from 'src/declarations/repositories/user';
import { Repository } from 'typeorm';
import { UserEntity } from './entity';
import { UserMapper } from './mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly adaptee: Repository<UserEntity>,
  ) {}

  async find(): Promise<RepositoryResult<UserModel[]>> {
    const entities = await this.adaptee.find();

    const result = entities.map(UserMapper.toModel);

    return new RepositoryOk(result);
  }

  async findByEmail(key: string): Promise<RepositoryResult<Option<UserModel>>> {
    const entity = await this.adaptee.findOne({ email: key });

    if (!entity) {
      return new RepositoryOk(new None());
    }

    const result = UserMapper.toModel(entity);

    return new RepositoryOk(new Some(result));
  }

  async save(email: string): Promise<RepositoryResult<UserModel>> {
    const newone = this.adaptee.create({ email });

    const entity = await this.adaptee.save(newone);

    const result = UserMapper.toModel(entity);

    return new RepositoryOk(result);
  }
}
