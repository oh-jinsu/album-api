import { Option } from "src/core/types/option";
import { FriendModel } from "src/declarations/models/friend";
import {
  FriendRepository,
  SaveFriendDto,
} from "src/declarations/repositories/friend";

export class MockFriendRepository implements FriendRepository {
  findOne = jest.fn<Promise<Option<FriendModel>>, [string, string]>();

  findByUserId = jest.fn<
    Promise<{ next?: string; items: FriendModel[] }>,
    [string, number, string]
  >();

  findByAlbumId = jest.fn<Promise<FriendModel[]>, [string]>();

  save = jest.fn<Promise<FriendModel>, [SaveFriendDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
