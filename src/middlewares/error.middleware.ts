import { NextFunction, Request, Response } from 'express';
import HTTPError from '../shared/utils/HTTPError.js';

export default function (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof HTTPError) {
        return res.status(err.status).json({ message: err.message });
    }

    console.error(err);
    return res
        .status(500)
        .json({ message: (err as Error).message || 'Internal Server Error' });
}
