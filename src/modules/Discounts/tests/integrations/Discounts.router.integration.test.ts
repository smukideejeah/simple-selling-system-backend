import request from 'supertest';
import app from '../../../../app';
import { prisma } from '../../../../lib/prisma';
import DiscountDto from '../../../../shared/types/Discount/Discount.dto.type';
import ProductDto from '../../../../shared/types/Product/Product.dto.type';


describe('Testing the most critical routes of DiscountRoutes', () => {
    const createdDiscounts: DiscountDto[] = [];
    const createdProducts: ProductDto[] = [];
    let adminToken: string;

    beforeAll(async () => {
        const login = await request(app).post('/v1/auth').send({
            Username: 'testAdmin',
            Password: 'testadmin123',
        });
        adminToken = login.body.token;

        const productsToCreate = [
            {
                Code: 'P00D1',
                Name: 'Product 1',
                Description: 'Description 1',
                Price: 10.5,
                Measure: 'UNIDAD',
                IsActive: true,
            },
            {
                Code: 'P00D2',
                Name: 'Product 2',
                Description: 'Description 2',
                Price: 20.0,
                Measure: 'KILO',
                IsActive: true,
            },
            {
                Code: 'P00D3',
                Name: 'Product 3',
                Description: 'Description 3',
                Price: 15.75,
                Measure: 'LITRO',
                IsActive: false,
            },
            {
                Code: 'P00D4',
                Name: 'Product 4',
                Description: 'Description 4',
                Price: 30.0,
                Measure: 'UNIDAD',
                IsActive: true,
            },
            {
                Code: 'P00D5',
                Name: 'Product 5',
                Description: 'Description 5',
                Price: 25.0,
                Measure: 'KILO',
                IsActive: true,
            },
            {
                Code: 'P00D6',
                Name: 'Product 6',
                Description: 'Description 6',
                Price: 12.0,
                Measure: 'LITRO',
                IsActive: false,
            },
        ];
        for (const prod of productsToCreate) {
            const response = await request(app)
            .post('/v1/products').send(prod)
            .set('Authorization', `Bearer ${adminToken}`);
            createdProducts.push(response.body);
        }

        const discountsToCreate = [
            {
                ProductID: createdProducts[0].ID,
                Percentage: 10,
                ValidFrom: new Date('2024-01-01'),
                ValidTo: new Date('2024-12-31'),
                isActive: true,
            },
            {
                ProductID: createdProducts[1].ID,
                Percentage: 20,
                ValidFrom: new Date('2024-02-01'),
                ValidTo: new Date('2024-11-30'),
                isActive: true,
            },
            {
                ProductID: createdProducts[2].ID,
                Percentage: 15,
                ValidFrom: new Date('2024-03-01'),
                ValidTo: new Date('2024-10-31'),
                isActive: false,
            },
        ];

        for (const disc of discountsToCreate) {
            const response = await request(app)
            .post('/v1/discounts').send(disc)
            .set('Authorization', `Bearer ${adminToken}`);
            createdDiscounts.push(response.body);
        }
    });


    it('GET /discounts - should return 200 and a list of paginated discounts', async () => {
        //Arrange
        const responseExpectStatus = 200;

        //Act
        const response = await request(app)
            .get('/v1/discounts/')
            .set('Authorization', `Bearer ${adminToken}`)
            .query({ take: 2 });

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body.Discounts.length).toBe(2);
        expect(response.body.NextCursor).toBeDefined();
    });

    // it('GET /discounts/:id - Should return 200 and one discount', async () => {
    //     //Arrange
    //     const discountToGet = createdDiscounts[0];
    //     const responseExpectStatus = 200;

    //     //Act
    //     const response = await request(app)
    //     .get(
    //         `/v1/discounts/${discountToGet.ID}`
    //     )
    //     .set('Authorization', `Bearer ${adminToken}`);

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);
    //     expect(response.body).toEqual(discountToGet);
    // });

    // it('GET /discounts/:id - Should return 404 when discount not found', async () => {
    //     //Arrange
    //     const nonExistentDiscountId = '123e4567-e89b-12d3-a456-426614174999';
    //     const responseExpectStatus = 404;

    //     //Act
    //     const response = await request(app)
    //     .get(
    //         `/v1/discounts/${nonExistentDiscountId}`
    //     )
    //     .set('Authorization', `Bearer ${adminToken}`);

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);
    // });

    // it('POST /discounts - Should create a new discount and return 201', async () => {
    //     //Arrange
    //     const newDiscountData = {
    //         ProductID: createdProducts[3].ID,
    //         Percentage: 25,
    //         ValidFrom: new Date('2024-04-01'),
    //         ValidTo: new Date('2024-09-30'),
    //         isActive: true,
    //     };
    //     const responseExpectStatus = 201;

    //     //Act
    //     const response = await request(app)
    //         .post('/v1/discounts')
    //         .set('Authorization', `Bearer ${adminToken}`)
    //         .send(newDiscountData);

        

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);
    //     expect(response.body).toMatchObject(newDiscountData);

    //     await prisma.discounts.deleteMany({ where: { ID: response.body.ID } });
    // });

    // it('POST /discounts - Should return 400 when required fields are missing', async () => {
    //     //Arrange
    //     const incompleteDiscountData = {
    //         ProductID: createdProducts[4].ID,
    //         // Percentage is missing
    //         ValidFrom: new Date('2024-05-01'),
    //         ValidTo: new Date('2024-08-31'),
    //         isActive: true,
    //     };
    //     const responseExpectStatus = 400;

    //     //Act
    //     const response = await request(app)
    //         .post('/v1/discounts')
    //         .set('Authorization', `Bearer ${adminToken}`)
    //         .send(incompleteDiscountData);

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);
    // });

    // it('GET /discounts/:id - Should return 404 when discount not found by ID', async () => {
    //     //Arrange
    //     const nonExistentDiscountId = 'NONEXISTENTCODE';
    //     const responseExpectStatus = 404;

    //     //Act
    //     const response = await request(app)
    //     .get(`/v1/discounts/${nonExistentDiscountId}`)
    //     .set('Authorization', `Bearer ${adminToken}`);

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);
    // });

    // it('DELETE /discounts/:id - Should delete a discount and return 200', async () => {
    //     //Arrange
    //     const discountToDelete = createdDiscounts[2];
    //     const responseExpectStatus = 200;

    //     //Act
    //     const response = await request(app)
    //     .delete(
    //         `/v1/discounts/${discountToDelete.ID}`
    //     )
    //     .set('Authorization', `Bearer ${adminToken}`);

    //     //Assert
    //     expect(response.status).toBe(responseExpectStatus);

    //     //Verify deletion
    //     const getResponse = await request(app).get(
    //         `/v1/discounts/${discountToDelete.ID}`
    //     ).
    //     set('Authorization', `Bearer ${adminToken}`);
    //     expect(getResponse.status).toBe(404);
    // });

    afterAll(async () => {
        for(const prod of createdProducts) {
            try{
                await prisma.products.deleteMany({ where: { ID: prod.ID } });
            }catch(err) {
                //ignore errors
            }
        }
        for(const disc of createdDiscounts) {
            try{
                await prisma.discounts.deleteMany({ where: { ID: disc.ID } });
            }catch(err) {
                //ignore errors
            }
        }
        await prisma.$disconnect();
    });
});
