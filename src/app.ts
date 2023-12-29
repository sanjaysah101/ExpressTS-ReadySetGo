import express, { type Application } from 'express';
import dotenv from 'dotenv';

import { routes } from './routes';

dotenv.config();

// Boot express
export const app: Application = express();

// Application routing
routes(app);
