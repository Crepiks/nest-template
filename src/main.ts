/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppEnvironment, getAppConfig } from './config/app.config';

const bootstrap = async () => {
  const appConfig = getAppConfig();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (appConfig.environment !== AppEnvironment.Production) {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('Documentation of NestJS API')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();

    const options = {
      customCss: '.swagger-ui section.models { display: none; }',
    };

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, options);

    console.log('Swagger has been initialized');
  }

  await app.listen(appConfig.port);
};

bootstrap();
