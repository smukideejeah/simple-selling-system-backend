import { Request, Response } from 'express';
import ReportService from './Reports.service.js';

export default class {
    constructor(private readonly service: ReportService) {}

    top10Report = async (Req: Request, Res: Response) => {
        const report = await this.service.Top10ProductsReport();
        return Res.status(200).json(report);
    };
}
