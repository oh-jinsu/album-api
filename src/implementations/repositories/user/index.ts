import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";
import { UserRepository } from "src/declarations/repositories/user";
import { Repository } from "typeorm";
import { UserEntity } from "./entity";
import { UserMapper } from "./mapper";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly adaptee: Repository<UserEntity>,
  ) {}

  async find(): Promise<UserModel[]> {
    const entities = await this.adaptee.find();

    const result = entities.map(UserMapper.toModel);

    return result;
  }

  async findById(key: string): Promise<Option<UserModel>> {
    const entity = await this.adaptee.findOne({ id: key });

    if (!entity) {
      return new None();
    }

    const result = UserMapper.toModel(entity);

    return new Some(result);
  }

  async save({
    id,
    email,
  }: {
    id: string;
    email?: string;
  }): Promise<UserModel> {
    const newone = this.adaptee.create({ id, email });

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
