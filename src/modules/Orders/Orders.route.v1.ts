import { Router } from 'express';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import MatchUserMiddleware from '../../middlewares/MatchUser.middleware.js';
import { Controller } from './Orders.di.js';

const OrdersRouterV1 = Router();

OrdersRouterV1.get('/:id', Controller.getById);
OrdersRouterV1.get(
    '/user/:userId',
    MatchUserMiddleware,
    Controller.getByUserId
);
OrdersRouterV1.get('/', RolesMiddleware('GESTOR'), Controller.getAll);
OrdersRouterV1.post('/', RolesMiddleware('VENDEDOR'), Controller.create);

export default OrdersRouterV1;
