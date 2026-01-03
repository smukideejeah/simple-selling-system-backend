import { Decimal } from '@prisma/client/runtime/client';
import { mapProduct, mapProducts } from '../../Products.mapper';

describe('Testing the most important scenarios of products.mapper', () => {
    it('should map one product data correctly', () => {
        // Arrange
        const productData = {
            ID: '123e4567-e89b-12d3-a456-426614174000',
            Code: 'PROD001',
            Name: 'Test Product',
            Description: 'This is a test product',
            Price: new Decimal('100'),
            Measure: 'UNIDAD',
            IsActive: true,
            Discount: {
                ID: 'discount-id',
                ProductID: '123e4567-e89b-12d3-a456-426614174000',
                Value: new Decimal('15'),
                Type: 'PORCENTAJE',
                IsActive: true,
                StartDate: new Date('2024-01-01'),
                EndDate: new Date('2024-12-31'),
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        };

        // Act
        const mapped = mapProduct(productData);

        // Assert
        expect(mapped).toEqual({
            ID: productData.ID,
            Code: productData.Code,
            Name: productData.Name,
            Description: productData.Description,
            Price: 100,
            Measure: 'UNIDAD',
            IsActive: productData.IsActive,
            Discount: {
                percentage: 15,
                isActive: productData.Discount!.IsActive,
                startDate: productData.Discount!.StartDate,
                endDate: productData.Discount!.EndDate,
            },
        });
    });

    it('should return null when mapping a null product', () => {
        // Act
        const mapped = mapProduct(null);

        // Assert
        expect(mapped).toBeNull();
    });

    it('should map a product without discount correctly', () => {
        // Arrange
        const productData = {
            ID: '123e4567-e89b-12d3-a456-426614174000',
            Code: 'PROD002',
            Name: 'Test Product 2',
            Description: 'This is another test product',
            Price: new Decimal('200'),
            Measure: 'KILO',
            IsActive: true,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            DeletedAt: null,
        };

        // Act
        const mapped = mapProduct(productData);

        // Assert
        expect(mapped).toEqual({
            ID: productData.ID,
            Code: productData.Code,
            Name: productData.Name,
            Description: productData.Description,
            Price: 200,
            Measure: 'KILO',
            IsActive: productData.IsActive,
            Discount: null,
        });
    });

    it('should map a list of products with pagination correctly', () => {
        // Arrange
        const productsData = [];
        for (let i = 1; i <= 6; i++) {
            productsData.push({
                ID: crypto.randomUUID(),
                Code: `CODE${i}`,
                Name: `Product ${i}`,
                Description: `Description for product ${i}`,
                Price: new Decimal((i * 10).toString()),
                Measure: 'UNIDAD',
                IsActive: true,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                DeletedAt: null,
            });
        }
        const take = 5;

        // Act
        const mappedPagination = mapProducts(productsData, take);

        // Assert
        expect(mappedPagination.Products.length).toBe(5);
        expect(mappedPagination.NextCursor).toEqual({
            ID: productsData[4].ID,
            Name: productsData[4].Name,
        });
    });
});
