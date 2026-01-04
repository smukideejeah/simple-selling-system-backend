import { Decimal } from '@prisma/client/runtime/client';
import ProductsRepository from '../../Products.repository';
import ProductsService from '../../Products.service';
import { jest } from '@jest/globals';

describe('Testing the most important methods of ProductsService', () => {
    let repository: {
        findById: jest.Mock<any>;
        findByCode: jest.Mock<any>;
        findAll: jest.Mock<any>;
        create: jest.Mock<any>;
        update: jest.Mock<any>;
        delete: jest.Mock<any>;
    };

    let service: ProductsService;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            findByCode: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        service = new ProductsService(repository as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get a product by ID', async () => {
        //Arrange
        const productData = {
            ID: '123e4567-e89b-12d3-a456-426614174000',
            Code: 'PROD001',
            Name: 'Test Product',
            Description: 'This is a test product',
            Price: new Decimal('100'),
            Measure: 'UNIDAD',
            IsActive: true,
            Discount: null,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        };

        //Act
        repository.findById.mockResolvedValue(productData);
        const result = await service.getById(productData.ID);

        //Assert
        expect(repository.findById).toHaveBeenCalledWith(productData.ID);
        expect(result).toEqual({
            ID: productData.ID,
            Code: productData.Code,
            Name: productData.Name,
            Description: productData.Description,
            Price: 100,
            Measure: 'UNIDAD',
            IsActive: productData.IsActive,
            Discount: null,
        });
    });

    it('should return null when product not found by ID', async () => {
        //Arrange
        const productId = 'non-existent-id';

        //Act
        repository.findById.mockResolvedValue(null);
        const result = await service.getById(productId);

        //Assert
        expect(repository.findById).toHaveBeenCalledWith(productId);
        expect(result).toBeNull();
    });

    it('should get a product by Code', async () => {
        //Arrange
        const productData = {
            ID: '123e4567-e89b-12d3-a456-426614174000',
            Code: 'PROD001',
            Name: 'Test Product',
            Description: 'This is a test product',
            Price: new Decimal('100'),
            Measure: 'UNIDAD',
            IsActive: true,
            Discount: null,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        };

        //Act
        repository.findByCode.mockResolvedValue(productData);
        const result = await service.getByCode(productData.Code);

        //Assert
        expect(repository.findByCode).toHaveBeenCalledWith(productData.Code);
        expect(result).toEqual({
            ID: productData.ID,
            Code: productData.Code,
            Name: productData.Name,
            Description: productData.Description,
            Price: 100,
            Measure: 'UNIDAD',
            IsActive: productData.IsActive,
            Discount: null,
        });
    });

    it('should return null when product not found by Code', async () => {
        //Arrange
        const productCode = 'NONEXISTENTCODE';

        //Act
        repository.findByCode.mockResolvedValue(null);
        const result = await service.getByCode(productCode);

        //Assert
        expect(repository.findByCode).toHaveBeenCalledWith(productCode);
        expect(result).toBeNull();
    });

    it('should create a new product', async () => {
        //Arrange
        const productInput = {
            Code: 'PROD002',
            Name: 'New Product',
            Description: 'This is a new product',
            Price: 150,
            Measure: 'KILO' as const,
            IsActive: true,
        };

        const createdProductData = {
            ID: '223e4567-e89b-12d3-a456-426614174000',
            ...productInput,
            Price: new Decimal('150'),
            Discount: null,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        };

        //Act
        repository.create.mockResolvedValue(createdProductData);
        const result = await service.create(productInput);

        //Assert
        expect(repository.create).toHaveBeenCalledWith(productInput);
        expect(result).toEqual({
            ID: createdProductData.ID,
            Code: createdProductData.Code,
            Name: createdProductData.Name,
            Description: createdProductData.Description,
            Price: 150,
            Measure: 'KILO',
            IsActive: createdProductData.IsActive,
            Discount: null,
        });
    });
});
