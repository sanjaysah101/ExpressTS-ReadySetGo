import { type Application, type Router } from 'express';
import { PingController } from './controllers/PingController';
import { IndexController } from './controllers/IndexController';

const _routes: Array<[string, Router]> = [
  ['/', IndexController],
  ['/ping', PingController],
];

export const routes = (app: Application): void => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
