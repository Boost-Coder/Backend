import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../Entity/User';
import { GradeRank } from '../Entity/GradeRank';
import { GitHubRank } from '../Entity/GithHubRank';
import { AlgorithmRank } from '../Entity/AlgorithmRank';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
            entities: [User, GradeRank, GitHubRank, AlgorithmRank],
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
