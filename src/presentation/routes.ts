import { Router } from 'express';
import { AuthRoutes } from './auth/route';
import { CategoriesRoutes } from './category/route';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/categories', CategoriesRoutes.routes );

    return router;
  }
}

