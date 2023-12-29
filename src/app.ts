import express, { type Application } from 'express';
import dotenv from 'dotenv';
import pinoHTTP from 'pino-http';

import { logger } from './utils/Logger';

// import { logger } from './utils/Logger';
import { routes } from './routes';

dotenv.config();

// Boot express
export const app: Application = express();

app.use(pinoHTTP({ logger }));

// Application routing
routes(app);
