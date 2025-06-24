import * as jwt from 'jsonwebtoken';

export interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
  email: string;
}
