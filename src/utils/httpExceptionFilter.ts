import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger();

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.error(
            `${request.method} ${request.url} ${new Date()} [Error] ${exception} `,
            'HTTP ERROR',
        );

        response.status(status).json({
            statusCode: status,
            path: request.url,
            message: '유저 인증 실패 , Token 을 확인하세요',
        });
    }
}
