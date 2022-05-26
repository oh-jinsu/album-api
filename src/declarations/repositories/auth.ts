import { Option } from "src/core/types/option";
import { AuthModel } from "../models/auth";

export type SaveAuthDto = {
  key: string;
  from: string;
};

export type UpdateAuthDto = Partial<
  Omit<AuthModel, "id" | "updatedAt" | "createdAt">
>;

export abstract class AuthRepository {
  abstract findOne(id: string): Promise<Option<AuthModel>>;

  abstract findOneByKey(key: string): Promise<Option<AuthModel>>;

  abstract save(dto: SaveAuthDto): Promise<AuthModel>;

  abstract update(id: string, dto: UpdateAuthDto): Promise<AuthModel>;

  abstract delete(id: string): Promise<void>;
}
