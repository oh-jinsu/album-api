import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { isProduction } from "src/core/environment";
import { UserRepository } from "src/declarations/repositories/user";
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
        entities: [UserEntity],
        synchronize: true,
        dropSchema: !isProduction,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserRepository],
})
export class RepositoryModule {}
