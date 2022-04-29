import { Option } from "src/core/enums/option";
import { AuthModel } from "../models/auth";

export type SaveAuthDto = {
  key: string;
  from: string;
};

export abstract class AuthRepository {
  abstract findOne(id: string): Promise<Option<AuthModel>>;

  abstract findOneByKey(key: string): Promise<Option<AuthModel>>;

  abstract save(dto: SaveAuthDto): Promise<AuthModel>;

  abstract updateAccessToken(
    id: string,
    accessToken: string,
  ): Promise<AuthModel>;

  abstract updateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<AuthModel>;

  abstract delete(id: string): Promise<void>;
}
