import { NextFunction, Request, Response } from 'express';
import HTTPError from '../shared/utils/HTTPError.js';
import { jwtVerify } from 'jose';
import AuthToken from '../shared/types/Auth/Auth.token.type.js';
import secret from '../lib/JwtSecret.js';

export default async function (
    Req: Request,
    Res: Response,
    Next: NextFunction
) {
    const authHeader = Req.headers.authorization;
    if (!authHeader) throw new HTTPError('Authorization header missing', 401);

    const token = authHeader.split(' ')[1];
    if (!token) throw new HTTPError('Token missing', 401);

    try {
        const verify = await jwtVerify(token, secret);
        Req.user = verify.payload as AuthToken;

        Next();
    } catch (error) {
        console.error((error as Error).name);
        throw new HTTPError('Invalid token', 403);
    }
}
