import { Option } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";

export type SaveUserDto = { id: string; email?: string };

export type UpdateUserDto = Partial<
  Omit<UserModel, "id" | "updatedAt" | "createdAt">
>;

export abstract class UserRepository {
  abstract findById(key: string): Promise<Option<UserModel>>;

  abstract save(dto: SaveUserDto): Promise<UserModel>;

  abstract update(id: string, dto: UpdateUserDto): Promise<UserModel>;
}
