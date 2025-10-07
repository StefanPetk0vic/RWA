import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // or a proper payload type { sub: number; email: string; ... }
  }
}
