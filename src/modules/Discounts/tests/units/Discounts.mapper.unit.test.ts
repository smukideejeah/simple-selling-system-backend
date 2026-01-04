import { Decimal } from '@prisma/client/runtime/client';
import { mapDiscount, mapDiscounts } from '../../Discounts.mapper';

describe('Testing the most important scenarios of products.mapper', () => {
    it('should map one product data correctly', () => {
        // Arrange
        const discountData = {
            ID: '123e4567-e89b-12d3-a456-426614174000',
            IsActive: true,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            ProductID: '223e4567-e89b-12d3-a456-426614174000',
            Value: new Decimal('15'),
            Type: 'PORCENTAJE',
            StartDate: new Date('2024-01-01'),
            EndDate: new Date('2024-12-31'),
            Product: {
                ID: '223e4567-e89b-12d3-a456-426614174000',
                Code: 'PROD001',
                Name: 'Test Product',
                Description: 'This is a test product',
                Price: new Decimal('100'),
                Measure: 'UNIDAD',
                IsActive: true,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                DeletedAt: null,
            },
        };

        // Act
        const mapped = mapDiscount(discountData);
        // Assert
        expect(mapped).toEqual({
            ID: discountData.ID,
            ProductID: discountData.ProductID,
            Percentage: 15,
            ValidFrom: discountData.StartDate,
            ValidTo: discountData.EndDate,
            isActive: discountData.IsActive,
            Product: {
                ID: discountData.Product.ID,
                Code: discountData.Product.Code,
                Name: discountData.Product.Name,
                Description: discountData.Product.Description,
                Price: 100,
                Measure: 'UNIDAD',
                IsActive: discountData.Product.IsActive,
            },
        });
    });


    it('should map a list of products with pagination correctly', () => {
        // Arrange
        const discountsData = [];
        for (let i = 1; i <= 6; i++) {
            const productId = crypto.randomUUID();
            discountsData.push({
                ID: crypto.randomUUID(),
                IsActive: true,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                ProductID: productId,
                Value: new Decimal('15'),
                Type: 'PORCENTAJE',
                StartDate: new Date('2024-01-01'),
                EndDate: new Date('2024-12-31'),
                Product: {
                    ID: productId,
                    Code: 'PROD00' + i,
                    Name: 'Test Product ' + i,
                    Description: 'This is a test product ' + i,
                    Price: new Decimal('100'),
                    Measure: 'UNIDAD',
                    IsActive: true,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                    DeletedAt: null,
                },
            });
        }
        const take = 5;

        // Act
        const mappedPagination = mapDiscounts(discountsData, take);

        // Assert
        expect(mappedPagination.Discounts.length).toBe(5);
        expect(mappedPagination.NextCursor).toEqual({
            ID: discountsData[4].ID,
        });
    });
});
