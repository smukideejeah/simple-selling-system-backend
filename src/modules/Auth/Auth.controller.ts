import { Request, Response } from 'express';
import AuthService from './Auth.service.js';
import HTTPError from '../../shared/utils/HTTPError.js';

export default class {
    constructor(private readonly Service: AuthService) {}

    auth = async (Req: Request, Res: Response) => {
        const { Username, Password } = Req.body;
        if (!Username || !Password)
            throw new HTTPError('Username and Password are required', 400);
        const user = await this.Service.verifyCredentials(Username, Password);
        if (!user) throw new HTTPError('Invalid credentials', 401);

        return Res.status(200).json(user);
    };

    me = async (Req: Request, Res: Response) => {
        return Res.status(200).json({
            userId: Req.user?.UserId,
            role: Req.user?.Role,
        });
    };
}
