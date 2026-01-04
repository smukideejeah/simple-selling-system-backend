
import request from "supertest";
import app from "../../../../app";
import { jwtVerify } from "jose";
import secret from "../../../../lib/JwtSecret";
import { prisma } from "../../../../lib/prisma";

describe('Testing the routes of Orders module', () => {
    let token: string;
    let userId: string;
    beforeAll(async () => {
        await prisma.orderItems.deleteMany();
        await prisma.orders.deleteMany();
        await prisma.discounts.deleteMany();
        await prisma.products.deleteMany();

        const now = new Date();
        const lastWeek = new Date(now);
        const nextWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        nextWeek.setDate(now.getDate() + 7);

        await prisma.products.create({
            data: {
                Code: 'P001',
                Name: 'Product 1',
                Description: 'Description 1',
                Price: 100,
                Measure: 'UNIDAD',
                IsActive: true,
                Discount: {
                    create: {
                        Type: 'PORCENTAJE',
                        Value: 10,
                        StartDate: lastWeek,
                        EndDate: nextWeek,
                        IsActive: true,
                    },
                }
            }
        })

        const login = await request(app).post('/v1/auth').send({
            Username: 'testVendedor',
            Password: 'testvendedor123',
        });
        token = login.body.token;

        const decodedToken = await jwtVerify(token, secret);
        userId = decodedToken.payload.UserId as string;
    });
    afterAll(async () => {
        await prisma.orderItems.deleteMany();
        await prisma.orders.deleteMany();
        await prisma.discounts.deleteMany();
        await prisma.products.deleteMany();
        await prisma.$disconnect();
    });

    it('should create an order successfully', async () => {
        //Arrange
        const product = await prisma.products.findFirstOrThrow();
        const orderInput = {
            UserId: userId,
            CustomerName: 'John',
            CustomerLastName: 'Doe',
            CustomerDNI: '12345678',
            Items: [
                {
                    ProductID: product.ID,
                    Qty: 2,
                },
            ],
        };

        //Act
        const response = await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${token}`)
            .send(orderInput);

        //Assert
        expect(response.status).toBe(201);
        expect(response.body.Total).toBe(180); // 10% discount on 200
        expect(response.body.Items).toHaveLength(1);
    });

    it('should fetch orders for the authenticated user', async () => {
        //Act
        const response = await request(app)
            .get('/v1/orders/user/'+userId)
            .set('Authorization', `Bearer ${token}`)
            .query({ take: 10 });

        //Assert
        expect(response.status).toBe(200);
        expect(response.body.Orders.length).toBeGreaterThan(0);
    });

    it('should be forbidden if the user tries to access orders of another user', async () => {
        //Act
        const response = await request(app)
            .get('/v1/orders/user/'+'00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${token}`)
            .query({ take: 10 });

        //Assert
        expect(response.status).toBe(403);
    });

    it('returns 404 when fetching a non-existent order by ID', async () => {
        //Act
        const response = await request(app)
            .get('/v1/orders/'+'00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${token}`);
            
        //Assert
        expect(response.status).toBe(404);
    });
});