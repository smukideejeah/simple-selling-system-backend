import { Router } from 'express';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import ReportsRepository from './Reports.repository.js';
import ReportService from './Reports.service.js';
import ReportsController from './Reports.controller.js';

const ReportRoutesV1 = Router();

//Composition Root
const Repository = new ReportsRepository();
const Service = new ReportService(Repository);
const Controller = new ReportsController(Service);

ReportRoutesV1.use(RolesMiddleware('GESTOR'));

ReportRoutesV1.get('/top10Products', Controller.top10Report);

export default ReportRoutesV1;
