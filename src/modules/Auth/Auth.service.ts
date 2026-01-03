import { compare } from 'bcrypt';
import AuthRepository from './Auth.repository.js';
import { SignJWT } from 'jose';
import secret from '../../lib/JwtSecret.js';

export default class {
    constructor(private readonly Repository: AuthRepository) {}

    async verifyCredentials(Username: string, Password: string) {
        const user = await this.Repository.findByUsername(Username);
        if (!user) return false;

        const compareHash = await compare(Password, user.Hash);
        if (!compareHash) return false;

        const token = await new SignJWT({
            UserId: user.ID,
            Role: user.Role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret);

        return token;
    }
}
