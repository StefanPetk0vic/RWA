import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
}
