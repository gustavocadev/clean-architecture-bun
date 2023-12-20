import { envs } from './config';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

const server = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes,
});

await server.start();
