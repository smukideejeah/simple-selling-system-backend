import { Router } from 'express';
import ProductsRouteV1 from '../modules/Products/Products.route.v1.js';

const V1Router = Router();

V1Router.get('/', (req, res) => {
    res.send('V1 API Root');
});

V1Router.use('/products', ProductsRouteV1);

export default V1Router;
