import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const requestedUserId = request.params.id;
        const userId = request.user.userId;
        if (requestedUserId !== userId) {
            throw new ForbiddenException('삭제할 권한이 없습니다.');
        }

        return true;
    }
}
