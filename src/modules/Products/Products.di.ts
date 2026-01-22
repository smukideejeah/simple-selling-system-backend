import ProductsRepository from './Products.repository.js';
import ProductsService from './Products.service.js';
import ProductsController from './Products.controller.js';

//Composition Root
const Repository = new ProductsRepository();
const Service = new ProductsService(Repository);
export const Controller = new ProductsController(Service);
