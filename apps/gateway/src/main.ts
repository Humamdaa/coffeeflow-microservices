import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const serviceName = process.env.SERVICE_NAME;
  const portString = process.env.PORT;

  if (serviceName !== 'gateway') {
    throw new Error('SERVICE_NAME must equal gateway');
  }
  if (!portString || !/^\d+$/.test(portString)) {
    throw new Error('PORT is required and must be an integer from 1 to 65535');
  }
  const port = Number(portString);
  if (port < 1 || port > 65535) {
    throw new Error('PORT must be between 1 and 65535');
  }

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
  Logger.log(JSON.stringify({ event: 'service.started', service: serviceName, port }), 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  Logger.error(JSON.stringify({ event: 'service.failed', service: 'gateway', message }));
  process.exitCode = 1;
});
