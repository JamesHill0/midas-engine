import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from 'nestjs-config';
import { Logger } from '@nestjs/common';
import { environment } from './config/development.env';

declare const module: any;

async function bootstrap() {
  const port = process.env.APP_PORT != null ? parseInt(process.env.APP_PORT) : environment.service.port;

  // const httpsOptions = {
  //   key: fs.readFileSync('./server.key'),
  //   cert: fs.readFileSync('./server.crt'),
  // };

  // const app = await NestFactory.create(AppModule, , { cors: true, httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    port: port,
    logger: console,
  });

  if (ConfigService.get('app.mode') !== 'PROD') {

    const options = new DocumentBuilder()
    .setTitle('File Manager')
    .setDescription('File Manager API Docs')
    .setVersion('1.0')
    .addTag('QA')
    .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.enableCors({
    credentials: true,
    origin: process.env.ALLOWED_HOSTS
  })

  await app.startAllMicroservicesAsync();
  await app.listen(port, () => console.log(`File Manager running on port ${port}`));
}

bootstrap();
