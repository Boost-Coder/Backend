import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './Config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StatModule } from './stat/stat.module';
import { RankModule } from './rank/rank.module';
import * as process from 'process';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
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
    providers: [AppService],
})
export class AppModule {}
