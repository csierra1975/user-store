import { Router } from 'express';
import { ImageController } from './controller';

export class ImagesRoutes {

  static get routes(): Router {

    const router = Router();

    const imageController = new ImageController()

    // Definir las rutas
    router.post('/:type/:img', imageController.getImage);

    return router;
  }

}

