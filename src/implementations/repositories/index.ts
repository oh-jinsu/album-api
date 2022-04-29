import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { isProduction } from "src/core/environment";
import { AlbumRepository } from "src/declarations/repositories/album";
import { AuthRepository } from "src/declarations/repositories/auth";
import { FriendRepository } from "src/declarations/repositories/friend";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";
import { UserRepository } from "src/declarations/repositories/user";
import { AlbumRepositoryImpl } from "./album";
import { AlbumEntity } from "./album/entity";
import { AuthRepositoryImpl } from "./auth";
import { AuthEntity } from "./auth/entity";
import { FriendRepositoryImpl } from "./friend";
import { FriendEntity } from "./friend/entity";
import { ImageRepositoryImpl } from "./image";
import { ImageEntity } from "./image/entity";
import { PhotoRepositoryImpl } from "./photo";
import { PhotoEntity } from "./photo/entity";
import { UserRepositoryImpl } from "./user";
import { UserEntity } from "./user/entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mysql",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        entities: [
          AuthEntity,
          UserEntity,
          AlbumEntity,
          PhotoEntity,
          FriendEntity,
          ImageEntity,
        ],
        synchronize: true,
        dropSchema: !isProduction,
      }),
    }),
    TypeOrmModule.forFeature([
      AuthEntity,
      UserEntity,
      AlbumEntity,
      PhotoEntity,
      FriendEntity,
      ImageEntity,
    ]),
  ],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: AlbumRepository,
      useClass: AlbumRepositoryImpl,
    },
    {
      provide: PhotoRepository,
      useClass: PhotoRepositoryImpl,
    },
    {
      provide: FriendRepository,
      useClass: FriendRepositoryImpl,
    },
    {
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
  ],
  exports: [
    AuthRepository,
    UserRepository,
    AlbumRepository,
    PhotoRepository,
    FriendRepository,
    ImageRepository,
  ],
})
export class RepositoryModule {}
