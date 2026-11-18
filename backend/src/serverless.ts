import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

export async function createServerlessApplication() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  await app.init();
  return app.getHttpAdapter().getInstance();
}
