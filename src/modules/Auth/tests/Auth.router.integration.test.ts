import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../lib/prisma';

describe('Testing the Authentication module', () => {
    let userToken: string;
    const fakeToken: string = 'fake.token.value.for.testing.purposes.only';

    beforeAll(async () => {
        const response = await request(app).post('/v1/auth').send({
            Username: 'testAdmin',
            Password: 'testadmin123',
        });
        userToken = response.body.token;
    });

    it('Should authenticate user with valid credentials and return a JWT token', async () => {
        //Arrange
        const authData = {
            Username: 'testAdmin',
            Password: 'testadmin123',
        };
        const responseExpectStatus = 200;

        //Act
        const response = await request(app).post('/v1/auth').send(authData);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
        expect(response.body).toHaveProperty('token');
    });

    it('Should fail authentication with invalid credentials', async () => {
        //Arrange
        const authData = {
            Username: 'testAdmin',
            Password: 'wrongpassword',
        };
        const responseExpectStatus = 401;

        //Act
        const response = await request(app).post('/v1/auth').send(authData);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    it('Should return 403 when accessing a protected route with an invalid token', async () => {
        //Arrange
        const responseExpectStatus = 403;

        //Act
        const response = await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${fakeToken}`);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    it('Should access a protected route with a valid token', async () => {
        //Arrange
        const responseExpectStatus = 200;

        //Act
        const response = await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${userToken}`);

        //Assert
        expect(response.status).toBe(responseExpectStatus);
    });

    afterAll(async () => {
        // Clean up resources if needed
        prisma.$disconnect();
    });

});