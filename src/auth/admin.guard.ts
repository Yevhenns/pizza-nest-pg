import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomJwtPayload } from './interfaces/auth.interface';
import { UserRole } from 'src/roles/interfaces/role.interface';
import { Request } from 'express';

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
