import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { None, Option, Some } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";
import {
  SaveUserDto,
  UserRepository,
} from "src/declarations/repositories/user";
import { Repository } from "typeorm";
import { UserEntity } from "./entity";
import { UserMapper } from "./mapper";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly adaptee: Repository<UserEntity>,
  ) {}
  async findOne(id: string): Promise<Option<UserModel>> {
    const entity = await this.adaptee.findOne(id);

    if (!entity) {
      return new None();
    }

    const result = UserMapper.toModel(entity);

    return new Some(result);
  }

  async findOneByFrom(from: string): Promise<Option<UserModel>> {
    const entity = await this.adaptee.findOne({ from });

    if (!entity) {
      return new None();
    }

    const result = UserMapper.toModel(entity);

    return new Some(result);
  }

  async save({ from, email }: SaveUserDto): Promise<UserModel> {
    const id = randomUUID();

    const newone = this.adaptee.create({
      id,
      from,
      name: process.env.DEFAULT_USERNAME,
      avatar: process.env.DEFAULT_AVATAR_ID,
      email,
    });

    const entity = await this.adaptee.save(newone);

    const result = UserMapper.toModel(entity);

    return result;
  }

  async update(
    id: string,
    dto: Partial<Omit<UserModel, "id" | "updatedAt" | "createdAt">>,
  ): Promise<UserModel> {
    this.adaptee.update(id, dto);

    const entity = await this.adaptee.findOne({ id });

    const result = UserMapper.toModel(entity);

    return result;
  }
}
