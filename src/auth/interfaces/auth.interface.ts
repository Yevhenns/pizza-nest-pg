import * as jwt from 'jsonwebtoken';
import { UserRole } from '~/roles/interfaces/role.interface';

export interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}
