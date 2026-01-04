import app from '../../../../app';
import { prisma } from '../../../../lib/prisma';
import ReportService from '../../../Reports/Reports.service';
import ReportsRepository from '../../Reports.repository';
import supertest from 'supertest';

describe('Reports Integration Tests', () => {

    describe('Reports Service Integration Tests', () => {
        beforeAll(async () => {

            await prisma.orderItems.deleteMany();
            await prisma.orders.deleteMany();
            await prisma.discounts.deleteMany();
            await prisma.products.deleteMany();
            await prisma.users.deleteMany({ where: { Username: 'testuser' } });
        });

        it('should return products ordered by total sold', async () => {
            //Arrange
            const product1 = await prisma.products.create({
                data: {
                    Code: 'P001',
                    Name: 'Product 1',
                    Description: 'Description 1',
                    Price: 10.0,
                    Measure: 'UNIDAD',
                    IsActive: true,
                },
            });

            const product2 = await prisma.products.create({
                data: {
                    Code: 'P002',
                    Name: 'Product 2',
                    Description: 'Description 2',
                    Price: 15.0,
                    Measure: 'UNIDAD',
                    IsActive: true,
                },
            });

            const user = await prisma.users.create({
                data: {
                    Username: 'testuser',
                    Hash: 'testpassword',
                    Role: 'GESTOR',
                    Names: 'Test User'
                },
            });

            await prisma.orders.create({
                data: {
                    UserID: user.ID,
                    Total: 100.0,
                    CustomerName: 'Test',
                    CustomerLastName: 'User',
                    CustomerDNI: '12345678',
                    PaymentMethod: 'EFECTIVO',
                    orderItems: {
                        create: [
                            {
                                ProductID: product1.ID,
                                UnitPrice: 10.0,
                                Qty: 3,
                                SubTotal: 30.0,
                                TotalDiscount: 0.0,
                                TotalItem: 30.0,
                            },
                            {
                                ProductID: product2.ID,
                                UnitPrice: 15.0,
                                Qty: 4,
                                SubTotal: 60.0,
                                TotalDiscount: 0.0,
                                TotalItem: 60.0,
                            },
                        ],
                    }
                }
            });
            const service = new ReportService(new ReportsRepository());

            //Act
            const report = await service.Top10ProductsReport();

            //Assert
            expect(report).toHaveLength(2);
            expect(report[0].productId).toBe(product2.ID);
            expect(report[0].total).toBe(60.0);
            expect(report[1].productId).toBe(product1.ID);
            expect(report[1].total).toBe(30.0);
        });
    });

    describe('Reports API Integration Tests', () => {
        let tokenClient = '';
        beforeAll(async () => {
            const login = await supertest(app).post('/v1/auth').send({
                Username: 'testVendedor',
                Password: 'testvendedor123',
            });
            tokenClient = login.body.token;
        });

        it('GET /reports/top10Products - should return 403 if accessed by a VENDEDOR role', async () => {
            //Arrange
            const responseExpectStatus = 403;

            //Act
            const response = await supertest(app)
                .get('/v1/reports/top10Products')
                .set('Authorization', `Bearer ${tokenClient}`);

            //Assert
            expect(response.status).toBe(responseExpectStatus);
        });
    });

    afterAll(async () => {
        await prisma.orderItems.deleteMany();
        await prisma.orders.deleteMany();
        await prisma.discounts.deleteMany();
        await prisma.products.deleteMany();
        await prisma.users.deleteMany({ where: { Username: 'testuser' } });
        await prisma.$disconnect();
    });

});

