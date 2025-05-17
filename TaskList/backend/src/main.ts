import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Esta línea habilita CORS para todas las rutas y orígenes
  await app.listen(3000);
}
bootstrap();
