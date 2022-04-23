import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from 'src/core/enums/option';
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

  async find(): Promise<UserModel[]> {
    return this.forProduction.find();
  }

  async findById(email: string): Promise<Option<UserModel>> {
    return this.forProduction.findById(email);
  }

  async save(dto: { id: string; email?: string }): Promise<UserModel> {
    return this.forProduction.save(dto);
  }
}
