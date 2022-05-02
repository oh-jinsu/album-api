import { Option } from "src/core/enums/option";
import { FriendModel } from "../models/friend";

export type SaveFriendDto = {
  userId: string;
  albumId: string;
};

export abstract class FriendRepository {
  abstract findOne(
    userId: string,
    albumId: string,
  ): Promise<Option<FriendModel>>;

  abstract findByUserId(
    userId: string,
    limit?: number,
    cursor?: string,
  ): Promise<{
    next?: string;
    items: FriendModel[];
  }>;

  abstract findByAlbumId(albumId: string): Promise<FriendModel[]>;

  abstract save(dto: SaveFriendDto): Promise<FriendModel>;

  abstract delete(id: string): Promise<void>;
}
