import { NestFactory } from '@nestjs/core';
import { EventsModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  await app.listen(3001);
}

bootstrap();
