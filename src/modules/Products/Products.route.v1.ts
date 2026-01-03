import { Router } from 'express';
import ProductsRepository from './Products.repository.js';
import ProductsService from './Products.service.js';
import ProductsController from './Products.controller.js';

const ProductsRouteV1 = Router();

//Composition Root
const Repository = new ProductsRepository();
const Service = new ProductsService(Repository);
const Controller = new ProductsController(Service);

ProductsRouteV1.get('/', Controller.getAll);
ProductsRouteV1.get('/code/:code', Controller.getByCode);
ProductsRouteV1.get('/:id', Controller.getById);
ProductsRouteV1.post('/', Controller.create);
ProductsRouteV1.patch('/:id', Controller.update);
ProductsRouteV1.delete('/:id', Controller.delete);

export default ProductsRouteV1;
