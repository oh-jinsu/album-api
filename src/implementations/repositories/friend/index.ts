import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { None, Option, Some } from "src/core/enums/option";
import { FriendModel } from "src/declarations/models/friend";
import {
  FriendRepository,
  SaveFriendDto,
} from "src/declarations/repositories/friend";
import { Repository } from "typeorm";
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

  async findByAlbumId(albumId: string): Promise<FriendModel[]> {
    const entities = await this.adaptee.find({
      albumId,
    });

    return entities.map(FriendMapper.toModel);
  }

  async save({ userId, albumId }: SaveFriendDto): Promise<FriendModel> {
    const newone = this.adaptee.create({ id: randomUUID(), userId, albumId });

    const entity = await this.adaptee.save(newone);

    return FriendMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
