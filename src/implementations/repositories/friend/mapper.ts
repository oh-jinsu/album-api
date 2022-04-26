import { FriendModel } from "src/declarations/models/friend";
import { FriendEntity } from "./entity";

export class FriendMapper {
  static toModel({
    id,
    userId,
    albumId,
    createdAt,
  }: FriendEntity): FriendModel {
    return new FriendModel({
      id,
      userId,
      albumId,
      createdAt,
    });
  }
}
