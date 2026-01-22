import { Router } from 'express';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import { Controller } from './Discounts.di.js';

const DiscountsRouteV1 = Router();

DiscountsRouteV1.use(RolesMiddleware('GESTOR'));

DiscountsRouteV1.get('/', Controller.getAll);
DiscountsRouteV1.get('/:id', Controller.getById);
DiscountsRouteV1.post('/', Controller.create);
DiscountsRouteV1.patch('/:id', Controller.update);
DiscountsRouteV1.delete('/:id', Controller.delete);

export default DiscountsRouteV1;
