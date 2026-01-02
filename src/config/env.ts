import { config } from 'dotenv';

config();

export default function (env: string) {
    return process.env[env] || null;
}
