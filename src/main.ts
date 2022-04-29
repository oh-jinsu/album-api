import { APP_GUARD, NestFactory } from "@nestjs/core";
import { Module, ValidationPipe } from "@nestjs/common";
import { AuthModule } from "./modules/auth/module";
import { ProviderModule } from "./implementations/providers";
import { RepositoryModule } from "./implementations/repositories";
import { ConfigModule } from "@nestjs/config";
import { HttpExceptionFilter } from "./core/filters/http";
import { ErrorFilter } from "./core/filters/error";
import { UtilModule } from "./modules/util/module";
import { AlbumModule } from "./modules/album";
import { PhotoModule } from "./modules/photo";
import { UserModule } from "./modules/user";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(),
    ProviderModule,
    RepositoryModule,
    AuthModule,
    UserModule,
    AlbumModule,
    PhotoModule,
    UtilModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorFilter(), new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(process.env.VERSION);

  await app.listen(3000);
}

bootstrap();
