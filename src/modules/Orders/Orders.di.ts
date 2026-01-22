import OrdersRepository from './Orders.repository.js';
import OrdersService from './Orders.service.js';
import OrdersController from './Orders.controller.js';

const Repository = new OrdersRepository();
const Service = new OrdersService(Repository);
export const Controller = new OrdersController(Service);
