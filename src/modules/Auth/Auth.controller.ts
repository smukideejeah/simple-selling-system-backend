import { Request, Response } from 'express';
import AuthService from './Auth.service.js';
import HTTPError from '../../shared/utils/HTTPError.js';

export default class {
    constructor(private readonly Service: AuthService) {}

    auth = async (Req: Request, Res: Response) => {
        const { Username, Password } = Req.body;
        const token = await this.Service.verifyCredentials(Username, Password);
        if (!token) throw new HTTPError('Invalid credentials', 401);

        return Res.status(200).json({ token });
    };
}
