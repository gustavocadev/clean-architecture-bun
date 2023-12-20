import { Router } from 'express';
import { AuthRoutes } from './auth/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Define your routes here
    router.use('/api/auth', AuthRoutes.routes);

    router.get('/', (req, res) => {
      res.send('Hello world!');
    });

    return router;
  }
}
