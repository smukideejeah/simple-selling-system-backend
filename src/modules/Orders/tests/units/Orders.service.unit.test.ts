import { Decimal } from '@prisma/client/runtime/client';
import OrdersService from '../../Orders.service';
import {jest} from '@jest/globals';
import OrdersCalculator from '../../Orders.calculator';

describe('Testing the most important methods of OrdersService', () => {
    let repository: {
        getById: jest.Mock<any>;
        getByUserId: jest.Mock<any>;
        getAll: jest.Mock<any>;
        create: jest.Mock<any>;
        productsById: jest.Mock<any>;
    };

    const products = [{
        ID: 'fake-product-id-1111',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        Code: 'PROD001',
        Name: 'Product 1',
        Description: 'Description 1',
        Price: new Decimal('100'),
        Measure: 'UNIDAD',
        IsActive: true,
        DeletedAt: null,
        Discount: {
            ID: 'fake-discount-id-3333',
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            ProductID: 'fake-product-id-2222',
            IsActive: false,
            Type: 'PORCENTAJE',
            Value: new Decimal('50'),
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2026-01-30'),
        },
    }, {
        ID: 'fake-product-id-2222',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        Code: 'PROD002',
        Name: 'Product 2',
        Description: 'Description 2',
        Price: new Decimal('50'),
        Measure: 'UNIDAD',
        IsActive: true,
        DeletedAt: null,
        Discount: {
            ID: 'fake-discount-id-3333',
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            ProductID: 'fake-product-id-2222',
            IsActive: true,
            Type: 'PORCENTAJE',
            Value: new Decimal('50'),
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2026-01-30'),
        },
    },
    {
        ID: 'fake-product-id-3333',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        Code: 'PROD003',
        Name: 'Product 3',
        Description: 'Description 3',
        Price: new Decimal('200'),
        Measure: 'UNIDAD',
        IsActive: true,
        DeletedAt: null,
        Discount: {
            ID: 'fake-discount-id-4444',
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            ProductID: 'fake-product-id-3333',
            IsActive: true,
            Type: 'PORCENTAJE',
            Value: new Decimal('10'),
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2025-12-31'),
        },
    }];

    const productsFields = [{
        ID: 'fake-product-id-1111',
        Price: 100,
        Discount: {
            IsActive: false,
            Value: 50,
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2026-01-30'),
        },
    }, {
        ID: 'fake-product-id-2222',
        Price: 50,
        Discount: {
            IsActive: true,
            Value: 50,
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2026-01-30'),
        },
    },
    {
        ID: 'fake-product-id-3333',
        Price: 200,
        Discount: {
            IsActive: true,
            Value: 10,
            StartDate: new Date('2025-12-01'),
            EndDate: new Date('2025-12-31'),
        },
    }];

    const createdOrderBase = {
        ID: 'fake-order-id-5678',
        UserID: 'fake-user-id-1234',
        CustomerName: 'John',
        CustomerLastName: 'Doe',
        CustomerDNI: '12345678',
        Total: 225,
        PaymentMethod: 'EFECTIVO',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        orderItems: [
            {
                ID: 'fake-order-item-id-0001',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                UnitPrice: 100,
                Qty: 2,
                TotalDiscount: 0,
                SubTotal: 200,
                TotalItem: 200,
                ProductID: 'fake-product-id-1111',
                OrderID: 'fake-order-id-5678',
            },
            {
                ID: 'fake-order-item-id-0002',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                UnitPrice: 50,
                Qty: 1,
                TotalDiscount: 25,
                SubTotal: 50,
                TotalItem: 25,
                ProductID: 'fake-product-id-2222',
                OrderID: 'fake-order-id-5678',
            },
        ],
    };

    let service: OrdersService;

    beforeEach(() => {
        repository = {
            getById: jest.fn(),
            getByUserId: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            productsById: jest.fn(),
        };

        service = new OrdersService(repository as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate items correctly with discounts applied', () => {
        // Arrange
        const orderItemsInput = [
            {ProductID: 'fake-product-id-1111', Qty: 2}, // No discount
            {ProductID: 'fake-product-id-2222', Qty: 1}, // 50% discount
            {ProductID: 'fake-product-id-3333', Qty: 1}, // Expired discount
        ];

        // Act
        const calculatedItems = OrdersCalculator.calculateItems(productsFields, orderItemsInput, new Date('2026-01-15'));

        // Assert
        expect(calculatedItems).toHaveLength(3);
        expect(calculatedItems[0]).toMatchObject({
            SubTotal: 200,
            TotalDiscount: 0,
            TotalItem: 200,
            UnitPrice: 100,
            Qty: 2,
        });
        expect(calculatedItems[1]).toMatchObject({
            SubTotal: 50,
            TotalDiscount: 25, // 50% of 50
            TotalItem: 25,
            UnitPrice: 50,
            Qty: 1,
        });
        expect(calculatedItems[2]).toMatchObject({
            SubTotal: 200,
            TotalDiscount: 0, // Discount expired
            TotalItem: 200,
            UnitPrice: 200,
            Qty: 1,
        });

    });

    it('throws error when product not found in calculateItems', () => {
        // Arrange
        const orderItemsInput = [
            {ProductID: 'non-existing-product-id', Qty: 1},
        ];

        //Act
        const result = () => OrdersCalculator.calculateItems(productsFields, orderItemsInput, new Date());

        //Assert
        expect(result).toThrow('Product with ID non-existing-product-id not found');
    });

    it('should calculate total correctly', () => {
        // Arrange
        const items = [
            {TotalItem: 100},
            {TotalItem: 50},
            {TotalItem: 25},
        ];

        // Act
        const total = OrdersCalculator.calculateTotal(items as any);

        // Assert
        expect(total).toBe(175);
    });

    
});