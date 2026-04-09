import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar política CORS para permitir peticiones cross-origin desde el cliente web
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
