import env from '../config/env.js';

const secret = new TextEncoder().encode(env('JWT_SECRET')!);
export default secret;
