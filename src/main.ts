import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './Config/winston.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
    initializeTransactionalContext();
    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });
    const config = new DocumentBuilder()
        .setTitle('Rank In')
        .setDescription('RankIn API Document')
        .setVersion('1.0')
        .addTag('auth')
        .addTag('users')
        .addTag('stat')
        .addTag('rank')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                name: 'JWT',
                in: 'header',
            },
            'accessToken',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
