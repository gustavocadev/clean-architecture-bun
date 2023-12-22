import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

await MongoDatabase.connect({
  dbName: envs.MONGO_DB_NAME ?? '',
  mongoUrl: envs.MONGO_URL ?? '',
});

const server = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes,
});

await server.start();
