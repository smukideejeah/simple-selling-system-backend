import { NextFunction, Request, Response } from 'express';
import HTTPError from '../shared/utils/HTTPError.js';

export default function (req: Request, _: Response, next: NextFunction) {
    if (req.user?.Role == 'GESTOR') return next();

    const { userId } = req.params;
    if (req.user?.UserId !== userId) throw new HTTPError('Forbidden', 403);

    return next();
}
