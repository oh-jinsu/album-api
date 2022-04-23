import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/module";
import { ProviderModule } from "./implementations/providers";
import { RepositoryModule } from "./implementations/repositories";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProviderModule,
    RepositoryModule,
    AuthModule,
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
