import { prisma } from '../../lib/prisma.js';

export default class {
    async findByUsername(Username: string) {
        return await prisma.users.findUnique({
            where: {
                Username,
            },
        });
    }
}
