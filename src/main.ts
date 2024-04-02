import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './Config/winston.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
