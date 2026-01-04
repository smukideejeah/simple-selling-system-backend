import 'dotenv/config';
import { PrismaClient } from './generated/lib/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { hash } from 'bcrypt';


const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 3306,
    connectionLimit: 5,
    connectTimeout: 15000,
    acquireTimeout: 15000,
    allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });
async function main() {
    const adminPasswordHash = await hash('admin123', 10);
    const testAdminPasswordHash = await hash('testadmin123', 10);
    const vendorPasswordHash = await hash('vendedor123', 10);
    const testVendorPasswordHash = await hash('testvendedor123', 10);

    await prisma.users.upsert({
        where: {Username: 'testAdmin'},
        update: {},
        create: {
            Username: 'testAdmin',
            Names: 'Test Admin',
            Hash: testAdminPasswordHash,
            Role: 'GESTOR',
        },
    });

    await prisma.users.upsert({
        where: { Username: 'admin' },
        update: {},
        create: {
            Username: 'admin',
            Names: 'Administrador',
            Hash: adminPasswordHash,
            Role: 'GESTOR',
        },
    });

    await prisma.users.upsert({
        where: { Username: 'testVendedor' },
        update: {},
        create: {
            Username: 'testVendedor',
            Names: 'Test Vendedor',
            Hash: testVendorPasswordHash,
            Role: 'VENDEDOR',
        },
    });

    await prisma.users.upsert({
        where: { Username: 'vendedor' },
        update: {},
        create: {
            Username: 'vendedor',
            Names: 'Vendedor',
            Hash: vendorPasswordHash,
            Role: 'VENDEDOR',
        },
    });

    const arroz = await prisma.products.upsert({
        where: { Code: 'PROD-001' },
        update: {},
        create: {
            Code: 'PROD-001',
            Name: 'Arroz',
            Description: 'Arroz blanco Presentación 1kg',
            Price: 1200,
            Measure: 'UNIDAD',
        },
    });

    await prisma.products.upsert({
        where: { Code: 'PROD-002' },
        update: {},
        create: {
            Code: 'PROD-002',
            Name: 'Frijoles',
            Description: 'Frijoles negros Presentación 800g',
            Price: 1500,
            Measure: 'UNIDAD',
        },
    });

    await prisma.discounts.upsert({
        where: { ProductID: arroz.ID },
        update: {},
        create: {
            ProductID: arroz.ID,
            Type: 'PORCENTAJE',
            Value: 10,
            StartDate: new Date(),
            EndDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            IsActive: true,
        },
    });

    console.log('Seed ejecutado correctamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
