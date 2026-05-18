import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../types';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const body: ApiError = {
      success: false,
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof AppError) {
    const body: ApiError = { success: false, error: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('Unhandled error:', err);
  const body: ApiError = { success: false, error: 'Internal server error' };
  res.status(500).json(body);
}

export function notFoundHandler(_req: Request, res: Response): void {
  const body: ApiError = { success: false, error: 'Route not found' };
  res.status(404).json(body);
}
