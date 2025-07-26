import * as jwt from 'jsonwebtoken';
import { UserRole } from './role.interface';

export interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}
