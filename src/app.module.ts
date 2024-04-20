import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './Config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StatModule } from './stat/stat.module';
import * as process from 'process';
import { HttpLoggerInterceptor } from './utils/httpLoggerInterceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/httpExceptionFilter';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
                }

                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV}.env`,
        }),
        AuthModule,
        UserModule,
        StatModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpLoggerInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
