import { Router } from 'express';
import ProductsRepository from './Products.repository.js';
import ProductsService from './Products.service.js';
import ProductsController from './Products.controller.js';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';

const ProductsRouteV1 = Router();

//Composition Root
const Repository = new ProductsRepository();
const Service = new ProductsService(Repository);
const Controller = new ProductsController(Service);

ProductsRouteV1.get('/', Controller.getAll);
ProductsRouteV1.get('/code/:code', Controller.getByCode);
ProductsRouteV1.get('/:id', Controller.getById);
ProductsRouteV1.post('/', RolesMiddleware('GESTOR'), Controller.create);
ProductsRouteV1.patch('/:id', RolesMiddleware('GESTOR'), Controller.update);
ProductsRouteV1.delete('/:id', RolesMiddleware('GESTOR'), Controller.delete);

export default ProductsRouteV1;
