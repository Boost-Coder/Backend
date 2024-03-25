import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './Config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './Config/winston.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV}.env`,
        }),
        WinstonModule.forRoot({
            transports: winstonOptions,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
