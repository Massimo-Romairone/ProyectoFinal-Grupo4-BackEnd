import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use((req, res, next) => {
    // Permitir postMessage/popups entre orígenes (más permisivo para dev)
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    // Remover Cross-Origin-Embedder-Policy si existe (evitar bloqueo de iframes)
    res.removeHeader('Cross-Origin-Embedder-Policy');
    next();
  });

  (app.getHttpAdapter().getInstance() as any).set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
