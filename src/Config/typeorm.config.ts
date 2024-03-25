import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../Entity/user';
import { Algorithm } from '../Entity/algorithm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Github } from '../Entity/github';
import { Grade } from '../Entity/grade';

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
            entities: [User, Algorithm, Github, Grade],
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
