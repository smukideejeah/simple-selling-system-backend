import { Router } from 'express';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import { Controller } from './Products.di.js';

const ProductsRouteV1 = Router();

ProductsRouteV1.get('/', Controller.getAll);
ProductsRouteV1.get('/code/:code', Controller.getByCode);
ProductsRouteV1.get('/:id', Controller.getById);
ProductsRouteV1.post('/', RolesMiddleware('GESTOR'), Controller.create);
ProductsRouteV1.patch('/:id', RolesMiddleware('GESTOR'), Controller.update);
ProductsRouteV1.delete('/:id', RolesMiddleware('GESTOR'), Controller.delete);

export default ProductsRouteV1;
