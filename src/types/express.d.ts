import AuthToken from '../shared/types/Auth/Auth.token.type.ts';

declare global {
    namespace Express {
        interface Request {
            user?: AuthToken;
        }
    }
}

export {};
