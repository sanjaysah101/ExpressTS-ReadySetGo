import { type Request, type Response, type NextFunction } from 'express';

export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
