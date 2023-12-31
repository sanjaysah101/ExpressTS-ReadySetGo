import { type NextFunction, type Request, type Response, Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
export const IndexController: Router = Router();

IndexController.get(
  '/',
  asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send({ data: 'Hello from Sanjay Sah' });
    } catch (e) {
      next(e);
    }
  }),
);
