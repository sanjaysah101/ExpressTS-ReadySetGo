import { type Request, type NextFunction, type Response } from 'express';
import { type Middleware } from 'types';

function asyncHandler(fn: Middleware) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export { asyncHandler };
