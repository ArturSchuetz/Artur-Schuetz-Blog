import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://artur-schuetz.de',
      'https://artur-schuetz.de',
      'http://artur-schuetz.com',
      'https://artur-schuetz.com',
      'http://manage.artur-schuetz.de',
      'https://manage.artur-schuetz.de',
      'http://manage.artur-schuetz.com',
      'https://manage.artur-schuetz.com',
    ],
    methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(1337);
}
bootstrap();
