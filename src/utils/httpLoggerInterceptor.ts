import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger();
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request: Request = context.switchToHttp().getRequest();
        this.logger.debug(request.body, 'HTTP');

        return next.handle().pipe(
            tap((data) => {
                const request = context.switchToHttp().getRequest();
                const response = context.switchToHttp().getResponse();
                const body = JSON.stringify(request.body);
                this.logger.debug(
                    `<${request.userId}> ${request.method} ${request.url} ${body} ${new Date()} ${response.statusCode} ${response.statusMessage}`,
                    'HTTP',
                );
            }),
            catchError((err) => {
                const body = JSON.stringify(request.body);
                this.logger.error(
                    `<${request['userId']}> ${request.method} ${request.url} ${body} ${new Date()} [Error]${err}`,
                    'HTTP ERROR',
                );
                return throwError(err);
            }),
        );
    }
}
