import { Router } from 'express';
import OrdersRepository from './Orders.repository.js';
import OrdersService from './Orders.service.js';
import OrdersController from './Orders.controller.js';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import MatchUserMiddleware from '../../middlewares/MatchUser.middleware.js';

const OrdersRouterV1 = Router();

const ordersRepository = new OrdersRepository();
const ordersService = new OrdersService(ordersRepository);
const ordersController = new OrdersController(ordersService);

OrdersRouterV1.get('/:id', ordersController.getById);
OrdersRouterV1.get(
    '/user/:userId',
    MatchUserMiddleware,
    ordersController.getByUserId
);
OrdersRouterV1.get('/', RolesMiddleware('GESTOR'), ordersController.getAll);
OrdersRouterV1.post('/', RolesMiddleware('VENDEDOR'), ordersController.create);

export default OrdersRouterV1;
