import { Router } from 'express';
import AuthRepository from './Auth.repository.js';
import AuthService from './Auth.service.js';
import AuthController from './Auth.controller.js';
import AuthMiddleware from '../../middlewares/Auth.middleware.js';

const AuthRouterV1 = Router();

//Composition Root
const Repository = new AuthRepository();
const Service = new AuthService(Repository);
const Controller = new AuthController(Service);

AuthRouterV1.post('/', Controller.auth);
AuthRouterV1.get('/me', AuthMiddleware, Controller.me);

export default AuthRouterV1;
