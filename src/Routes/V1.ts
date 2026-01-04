import { Router } from 'express';
import ProductsRouteV1 from '../modules/Products/Products.route.v1.js';
import AuthRouterV1 from '../modules/Auth/Auth.router.js';
import AuthMiddleware from '../middlewares/Auth.middleware.js';
import DiscountsRouteV1 from '../modules/Discounts/Discounts.route.v1.js';
import OrdersRouterV1 from '../modules/Orders/Orders.route.v1.js';
import ReportRoutesV1 from '../modules/Reports/Reports.route.v1.js';

const V1Router = Router();

V1Router.get('/', (req, res) => {
    res.send('V1 API Root');
});

V1Router.use('/auth', AuthRouterV1);
V1Router.use('/products', AuthMiddleware, ProductsRouteV1);
V1Router.use('/discounts', AuthMiddleware, DiscountsRouteV1);
V1Router.use('/orders', AuthMiddleware, OrdersRouterV1);
V1Router.use('/reports', AuthMiddleware, ReportRoutesV1);

export default V1Router;
