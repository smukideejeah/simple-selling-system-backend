import { Router } from 'express';

const V1Router = Router();

V1Router.get('/', (req, res) => {
    res.send('V1 API Root');
});

export default V1Router;
