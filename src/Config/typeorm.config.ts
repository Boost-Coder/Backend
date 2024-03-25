import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../Entity/user';
import { Algorithm } from '../Entity/algorithm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Github } from '../Entity/github';
import { Grade } from '../Entity/grade';
import { TotalPoint } from '../Entity/totalPoint';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_DATABASE'),
            entities: [User, Algorithm, Github, Grade, TotalPoint],
            synchronize: process.env.NODE_ENV !== 'prod',
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
