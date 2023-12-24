import { type NextFunction, type Request, type Response, Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';

export const PingController: Router = Router();

PingController.get(
  '/',
  asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send({ data: 'Pong!' });
    } catch (e) {
      next(e);
    }
  }),
);
