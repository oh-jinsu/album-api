import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { isProduction } from "src/core/environment";
import { AlbumRepository } from "src/declarations/repositories/album";
import { ImageRepository } from "src/declarations/repositories/image";
import { PhotoRepository } from "src/declarations/repositories/photo";
import { UserRepository } from "src/declarations/repositories/user";
import { AlbumRepositoryImpl } from "./album";
import { AlbumEntity } from "./album/entity";
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
        entities: [UserEntity, AlbumEntity, PhotoEntity, ImageEntity],
        synchronize: true,
        dropSchema: !isProduction,
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      AlbumEntity,
      PhotoEntity,
      ImageEntity,
    ]),
  ],
  providers: [
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
      provide: ImageRepository,
      useClass: ImageRepositoryImpl,
    },
  ],
  exports: [UserRepository, AlbumRepository, PhotoRepository, ImageRepository],
})
export class RepositoryModule {}
