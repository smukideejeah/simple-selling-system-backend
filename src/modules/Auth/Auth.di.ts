import AuthRepository from './Auth.repository.js';
import AuthService from './Auth.service.js';
import AuthController from './Auth.controller.js';

//Composition Root

const Repository = new AuthRepository();
const Service = new AuthService(Repository);
export const Controller = new AuthController(Service);
