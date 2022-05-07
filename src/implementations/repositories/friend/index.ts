import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/core/enums/option";
import { FriendModel } from "src/declarations/models/friend";
import {
  FriendRepository,
  SaveFriendDto,
} from "src/declarations/repositories/friend";
import { LessThan, Repository } from "typeorm";
import { v4 } from "uuid";
import { FriendEntity } from "./entity";
import { FriendMapper } from "./mapper";

@Injectable()
export class FriendRepositoryImpl implements FriendRepository {
  constructor(
    @InjectRepository(FriendEntity)
    private readonly adaptee: Repository<FriendEntity>,
  ) {}

  async findOne(userId: string, albumId: string): Promise<Option<FriendModel>> {
    const entity = await this.adaptee.findOne({
      userId,
      albumId,
    });

    if (!entity) {
      return new None();
    }

    return new Some(FriendMapper.toModel(entity));
  }

  async findByUserId(
    userId: string,
    limit?: number,
    cursor?: string,
  ): Promise<{ next?: string; items: FriendModel[] }> {
    const cursored = await this.adaptee.findOne({
      id: cursor,
    });

    const take = limit ? limit + (cursored ? 0 : 1) : null;

    const query = await this.adaptee.find({
      where: {
        userId,
        createdAt: LessThan(cursored?.createdAt || new Date()),
      },
      order: {
        createdAt: "DESC",
      },
      take,
    });

    if (cursored) {
      query.unshift(cursored);
    }

    const next = limit && query.length === limit + 1 ? query.pop() : null;

    return { next: next?.id, items: query.map(FriendMapper.toModel) };
  }

  async findByAlbumId(albumId: string): Promise<FriendModel[]> {
    const entities = await this.adaptee.find({
      albumId,
    });

    return entities.map(FriendMapper.toModel);
  }

  async save({ userId, albumId }: SaveFriendDto): Promise<FriendModel> {
    const newone = this.adaptee.create({ id: v4(), userId, albumId });

    const entity = await this.adaptee.save(newone);

    return FriendMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
