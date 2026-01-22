import DiscountsRepository from './Discounts.repository.js';
import DiscountsService from './Discounts.service.js';
import DiscountsController from './Discounts.controller.js';

//Composition Root
const Repository = new DiscountsRepository();
const Service = new DiscountsService(Repository);
export const Controller = new DiscountsController(Service);
