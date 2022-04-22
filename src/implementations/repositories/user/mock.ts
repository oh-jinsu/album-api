import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from 'src/core/option';
import { RepositoryResult } from 'src/core/results/repository';
import { UserModel } from 'src/declarations/models/user';
import { UserRepository } from 'src/declarations/repositories/user';
import { Repository } from 'typeorm';
import { UserRepositoryImpl } from '.';
import { UserEntity } from './entity';

@Injectable()
export class MockUserRepository implements UserRepository {
  private readonly forProduction: UserRepositoryImpl;

  constructor(
    @InjectRepository(UserEntity)
    private readonly adaptee: Repository<UserEntity>,
  ) {
    this.forProduction = new UserRepositoryImpl(adaptee);
  }

  async find(): Promise<RepositoryResult<UserModel[]>> {
    return this.forProduction.find();
  }

  async findByEmail(
    email: string,
  ): Promise<RepositoryResult<Option<UserModel>>> {
    return this.forProduction.findByEmail(email);
  }

  async save(email: string): Promise<RepositoryResult<UserModel>> {
    return this.forProduction.save(email);
  }
}
