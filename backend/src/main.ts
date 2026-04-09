import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitamos CORS para que el frontend de Vue (en otro puerto) tenga permiso de hacer peticiones
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
