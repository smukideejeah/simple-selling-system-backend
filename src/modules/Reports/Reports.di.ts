import ReportsRepository from './Reports.repository.js';
import ReportService from './Reports.service.js';
import ReportsController from './Reports.controller.js';

//Composition Root
const Repository = new ReportsRepository();
const Service = new ReportService(Repository);
export const Controller = new ReportsController(Service);
