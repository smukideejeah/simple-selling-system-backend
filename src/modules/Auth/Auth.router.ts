import { Router } from 'express';
import AuthMiddleware from '../../middlewares/Auth.middleware.js';
import { Controller } from './Auth.di.js';

const AuthRouterV1 = Router();

AuthRouterV1.post('/', Controller.auth);
AuthRouterV1.get('/me', AuthMiddleware, Controller.me);

export default AuthRouterV1;
