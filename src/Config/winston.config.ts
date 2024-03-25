import * as winston from 'winston';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from 'nest-winston';
export const winstonOptions = new winston.transports.Console({
    level: process.env.NODE_ENV === 'prod' ? 'http' : 'silly',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        nestWinstonModuleUtilities.format.nestLike('RankIn', {
            prettyPrint: true,
        }),
    ),
});

export const winstonLogger = WinstonModule.createLogger({
    transports: [winstonOptions],
});
