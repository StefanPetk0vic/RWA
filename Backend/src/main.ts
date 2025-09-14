import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as cookieParser from 'cookie-parser';
import { GameSeeder } from './game/game.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // baca grešku ako dođe nepoznato polje u dto
    }),
  );
  app.enableCors({
    origin: 'http://localhost:4200', // or true for all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.use(LoggerMiddleware);
  app.use(cookieParser());
  await app.get(GameSeeder).seed();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
console.log('Listening on port: http://localhost:3000');
