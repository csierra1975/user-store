import { Router } from 'express';
import { FileuUloadController } from './controller';
import { FileUploadService } from '../services';
import { FileUploadMiddleware } from '../middlewares/file-upload.middlewear';
import { TypeMiddleware } from '../middlewares/type.middleware';

export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();

    const fileUploadService = new FileUploadService()
    const controller = new FileuUloadController(fileUploadService)

    // estos middleware se ejecutan antes qeue los endpoints de abajo.
    // Si quisieramos que solo afectara a uno o solo unos pocos, tendríamos que pasarlo como parámetro en el post : router.post('/single/:type', TypeMiddleware.validTypes(['users','products','categories'], controller.uploadFile );
    router.use(FileUploadMiddleware.containeFiles)
    router.use(TypeMiddleware.validTypes(['users','products','categories']))

    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type', controller.uploadMultipleFile);

    return router;
  }

}

