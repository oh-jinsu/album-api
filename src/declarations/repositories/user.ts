import { Option } from "src/core/enums/option";
import { UserModel } from "src/declarations/models/user";

export type SaveUserDto = { from: string; email?: string };

export type UpdateUserDto = Partial<
  Omit<UserModel, "id" | "from" | "updatedAt" | "createdAt">
>;

export abstract class UserRepository {
  abstract findOne(id: string): Promise<Option<UserModel>>;

  abstract findOneByFrom(from: string): Promise<Option<UserModel>>;

  abstract save(dto: SaveUserDto): Promise<UserModel>;

  abstract update(id: string, dto: UpdateUserDto): Promise<UserModel>;
}
