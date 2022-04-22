import { Global, Module } from '@nestjs/common';
import { isProduction } from 'src/core/environments';
import { UserRepository } from 'src/declarations/repositories/user';
import { UserRepositoryImpl } from './user';
import { MockUserRepository } from './user/mock';

@Global()
@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: isProduction ? UserRepositoryImpl : MockUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class RepositoryModule {}
