import { NextFunction, Request, Response } from 'express';
import HTTPError from '../shared/utils/HTTPError.js';

export default function (...allowedRoles: ('GESTOR' | 'VENDEDOR')[]) {
    return (Req: Request, Res: Response, Next: NextFunction) => {
        const userRole = Req.user?.Role;
        if (!userRole || !allowedRoles.includes(userRole))
            throw new HTTPError('Forbidden: Insufficient role', 403);
        Next();
    };
}
