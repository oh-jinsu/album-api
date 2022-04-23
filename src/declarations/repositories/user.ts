import { Option } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";

export abstract class UserRepository {
  abstract find(): Promise<UserModel[]>;

  abstract findById(key: string): Promise<Option<UserModel>>;

  abstract save(dto: { id: string; email?: string }): Promise<UserModel>;
}
