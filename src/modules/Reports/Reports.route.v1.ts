import { Router } from 'express';
import RolesMiddleware from '../../middlewares/Roles.middleware.js';
import { Controller } from './Reports.di.js';

const ReportRoutesV1 = Router();

ReportRoutesV1.use(RolesMiddleware('GESTOR'));

ReportRoutesV1.get('/top10Products', Controller.top10Report);

export default ReportRoutesV1;
