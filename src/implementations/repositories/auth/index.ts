import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { None, Option, Some } from "src/core/enums/option";
import { AuthModel } from "src/declarations/models/auth";
import {
  AuthRepository,
  SaveAuthDto,
} from "src/declarations/repositories/auth";
import { Repository } from "typeorm";
import { AuthEntity } from "./entity";
import { AuthMapper } from "./mapper";

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly adaptee: Repository<AuthEntity>,
  ) {}

  async findOne(id: string): Promise<Option<AuthModel>> {
    const entity = await this.adaptee.findOne({
      id,
    });

    if (!entity) {
      return new None();
    }

    return new Some(AuthMapper.toModel(entity));
  }

  async findOneByKey(key: string): Promise<Option<AuthModel>> {
    const entity = await this.adaptee.findOne({
      key,
    });

    if (!entity) {
      return new None();
    }

    return new Some(AuthMapper.toModel(entity));
  }

  async save(dto: SaveAuthDto): Promise<AuthModel> {
    const newone = this.adaptee.create({
      id: randomUUID(),
      ...dto,
    });

    const entity = await this.adaptee.save(newone);

    return AuthMapper.toModel(entity);
  }

  async updateAccessToken(id: string, accessToken: string): Promise<AuthModel> {
    await this.adaptee.update(id, {
      accessToken,
    });

    const entity = await this.adaptee.findOne({
      id,
    });

    return AuthMapper.toModel(entity);
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<AuthModel> {
    await this.adaptee.update(id, {
      refreshToken,
    });

    const entity = await this.adaptee.findOne({
      id,
    });

    return AuthMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete({
      id,
    });
  }
}
