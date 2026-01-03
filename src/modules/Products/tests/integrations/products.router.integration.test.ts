import request from 'supertest';
import app from '../../../../app';
import ProductDto from '../../../../shared/types/Product/Product.dto.type';
import { prisma } from '../../../../lib/prisma';

describe('Testing the most critical routes of ProductsRouter', () => {
    const createdProducts: ProductDto[] = [];

    beforeAll(async () => {
        const productsToCreate = [
            {
                Code: 'P001',
                Name: 'Product 1',
                Description: 'Description 1',
                Price: 10.5,
                Measure: 'UNIDAD',
                IsActive: true,
            },
            {
                Code: 'P002',
                Name: 'Product 2',
                Description: 'Description 2',
                Price: 20.0,
                Measure: 'KILO',
                IsActive: true,
            },
            {
                Code: 'P003',
                Name: 'Product 3',
                Description: 'Description 3',
                Price: 15.75,
                Measure: 'LITRO',
                IsActive: false,
            },
            {
                Code: 'P004',
                Name: 'Product 4',
                Description: 'Description 4',
                Price: 30.0,
                Measure: 'UNIDAD',
                IsActive: true,
            },
            {
                Code: 'P005',
                Name: 'Product 5',
                Description: 'Description 5',
                Price: 25.0,
                Measure: 'KILO',
                IsActive: true,
            },
            {
                Code: 'P006',
                Name: 'Product 6',
                Description: 'Description 6',
                Price: 12.0,
                Measure: 'LITRO',
                IsActive: false,
            },
        ];
        for (const prod of productsToCreate) {
            const response = await request(app).post('/v1/products').send(prod);
            createdProducts.push(response.body);
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
    it('GET /products - should return 200 and a list of paginated products', async () => {
        //Arrange
        const responseExpectStatus = 200;

        //Act
        const response = await request(app)
            .get('/v1/products')
            .query({ take: 3 });

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body.Products.length).toBe(3);
        expect(response.body.NextCursor).toBeDefined();
    });

    it('GET /products/:id - Should return 200 and one product', async () => {
        //Arrange
        const productToGet = createdProducts[0];
        const responseExpectStatus = 200;

        //Act
        const response = await request(app).get(
            `/v1/products/${productToGet.ID}`
        );

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body).toEqual(productToGet);
    });

    it('GET /products/:id - Should return 404 when product not found', async () => {
        //Arrange
        const nonExistentProductId = '123e4567-e89b-12d3-a456-426614174999';
        const responseExpectStatus = 404;

        //Act
        const response = await request(app).get(
            `/v1/products/${nonExistentProductId}`
        );

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    it('POST /products - Should create a new product and return 201', async () => {
        //Arrange
        const newProductData = {
            Code: 'P007',
            Name: 'Product 7',
            Description: 'Description 7',
            Price: 18.0,
            Measure: 'UNIDAD',
            IsActive: true,
        };
        const responseExpectStatus = 201;

        //Act
        const response = await request(app)
            .post('/v1/products')
            .send(newProductData);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body).toMatchObject(newProductData);
    });

    it('POST /products - Should return 400 when required fields are missing', async () => {
        //Arrange
        const incompleteProductData = {
            Code: 'P008',
            Description: 'Description 8',
            Price: 22.0,
            Measure: 'KILO',
            IsActive: true,
        };
        const responseExpectStatus = 400;

        //Act
        const response = await request(app)
            .post('/v1/products')
            .send(incompleteProductData);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    it('GET /products/code/:code - Should return 200 and one product by Code', async () => {
        //Arrange
        const productToGet = createdProducts[1];
        const responseExpectStatus = 200;

        //Act
        const response = await request(app).get(
            `/v1/products/code/${productToGet.Code}`
        );

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body).toEqual(productToGet);
    });

    it('GET /products/code/:code - Should return 404 when product not found by Code', async () => {
        //Arrange
        const nonExistentProductCode = 'NONEXISTENTCODE';
        const responseExpectStatus = 404;

        //Act
        const response = await request(app).get(
            `/v1/products/code/${nonExistentProductCode}`
        );

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    it('DELETE /products/:id - Should delete a product and return 200', async () => {
        //Arrange
        const productToDelete = createdProducts[2];
        const responseExpectStatus = 200;

        //Act
        const response = await request(app).delete(
            `/v1/products/${productToDelete.ID}`
        );

        //Assert
        expect(response.status).toBe(responseExpectStatus);

        //Verify deletion
        const getResponse = await request(app).get(
            `/v1/products/${productToDelete.ID}`
        );
        expect(getResponse.status).toBe(404);
    });
});
