import { Router } from 'express';
import DiscountsRepository from './Discounts.repository.js';
import DiscountsService from './Discounts.service.js';
import DiscountsController from './Discounts.controller.js';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';

const DiscountsRouteV1 = Router();

//Composition Root
const Repository = new DiscountsRepository();
const Service = new DiscountsService(Repository);
const Controller = new DiscountsController(Service);

DiscountsRouteV1.use(RolesMiddleware('GESTOR'));

DiscountsRouteV1.get('/', Controller.getAll);
DiscountsRouteV1.get('/:id', Controller.getById);
DiscountsRouteV1.post('/', Controller.create);
DiscountsRouteV1.patch('/:id', Controller.update);
DiscountsRouteV1.delete('/:id', Controller.delete);

export default DiscountsRouteV1;
