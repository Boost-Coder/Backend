import * as winston from 'winston';
import {
    utilities,
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
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

export const dailyOption = () => {
    return {
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${process.env.NODE_ENV}`,
        filename: `%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('RankIn', {
                colors: false,
                prettyPrint: true,
            }),
        ),
    };
};

export const winstonLogger = WinstonModule.createLogger({
    transports: [winstonOptions, new winstonDaily(dailyOption())],
});
