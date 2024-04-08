import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const requestedUserId = request.params.id;
        const userId = request.user.userId;
        if (requestedUserId !== userId) {
            throw new ForbiddenException('수정할 권한이 없습니다.');
        }

        return true;
    }
}
