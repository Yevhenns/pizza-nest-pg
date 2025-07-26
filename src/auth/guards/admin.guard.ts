import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '~/common/interfaces/role.interface';
import { Request } from 'express';
import { CustomJwtPayload } from '~/common/interfaces/auth.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CustomJwtPayload;

    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Access denied');
    }

    return true;
  }
}
