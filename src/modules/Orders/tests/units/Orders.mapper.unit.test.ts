import { Decimal } from "@prisma/client/runtime/client";
import { mapOrder, mapOrders } from "../../Orders.mapper";

describe('Testing the most important scenarions of orders mapper', () => {
    it('should map order correctly', () => {
        //Arrange
        const createdOrderBase = {
            ID: 'fake-order-id-5678',
            UserID: 'fake-user-id-1234',
            CustomerName: 'John',
            CustomerLastName: 'Doe',
            CustomerDNI: '12345678',
            Total: new Decimal(225),
            PaymentMethod: 'EFECTIVO',
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            orderItems: [
                {
                    ID: 'fake-order-item-id-0001',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                    UnitPrice: new Decimal(100),
                    Qty: new Decimal(2),
                    TotalDiscount: new Decimal(0),
                    SubTotal: new Decimal(200),
                    TotalItem: new Decimal(200),
                    ProductID: 'fake-product-id-1111',
                    OrderID: 'fake-order-id-5678',
                },
                {
                    ID: 'fake-order-item-id-0002',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                    UnitPrice: new Decimal(50),
                    Qty: new Decimal(1),
                    TotalDiscount: new Decimal(25),
                    SubTotal: new Decimal(50),
                    TotalItem: new Decimal(25),
                    ProductID: 'fake-product-id-2222',
                    OrderID: 'fake-order-id-5678',
                },
            ],
        };

        //Act
        const mappedOrder = mapOrder(createdOrderBase);

        //Assert
        expect(mappedOrder).toEqual({
            ID: 'fake-order-id-5678',
            UserID: 'fake-user-id-1234',
            CustomerName: 'John',
            CustomerLastName: 'Doe',
            CustomerDNI: '12345678',
            Total: 225,
            CreatedAt: createdOrderBase.CreatedAt,
            Items: [
                {
                    ID: 'fake-order-item-id-0001',
                    OrderID: 'fake-order-id-5678',
                    ProductID: 'fake-product-id-1111',
                    UnitPrice: 100,
                    Qty: 2,
                    SubTotal: 200,
                    TotalDiscount: 0,
                    TotalItem: 200,
                },
                {
                    ID: 'fake-order-item-id-0002',
                    OrderID: 'fake-order-id-5678',
                    ProductID: 'fake-product-id-2222',
                    UnitPrice: 50,
                    Qty: 1,
                    SubTotal: 50,
                    TotalDiscount: 25,
                    TotalItem: 25,
                },
            ],
        });
    });

    it('should map order pagination correctly', () => {
        //Arrange
        const ordersData = [];
        for (let i = 1; i <= 21; i++) {
            ordersData.push({
                ID: 'fake-order-id-5678-' + i,
                UserID: 'fake-user-id-1234-' + i,
                CustomerName: 'John',
                CustomerLastName: 'Doe',
                CustomerDNI: '12345678',
                Total: new Decimal(225),
                PaymentMethod: 'EFECTIVO',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                orderItems: [
                    {
                        ID: 'fake-order-item-id-0001-' + i,
                        CreatedAt: new Date(),
                        UpdatedAt: new Date(),
                        UnitPrice: new Decimal(100),
                        Qty: new Decimal(2),
                        TotalDiscount: new Decimal(0),
                        SubTotal: new Decimal(200),
                        TotalItem: new Decimal(200),
                        ProductID: 'fake-product-id-1111',
                        OrderID: 'fake-order-id-5678-' + i,
                    },
                    {
                        ID: 'fake-order-item-id-0002-' + i,
                        CreatedAt: new Date(),
                        UpdatedAt: new Date(),
                        UnitPrice: new Decimal(50),
                        Qty: new Decimal(1),
                        TotalDiscount: new Decimal(25),
                        SubTotal: new Decimal(50),
                        TotalItem: new Decimal(25),
                        ProductID: 'fake-product-id-2222',
                        OrderID: 'fake-order-id-5678-' + i,
                    },
                ],
            });
        }

        //Act
        const mappedOrdersPagination = mapOrders(ordersData, 20);
        console.log(mappedOrdersPagination.NextCursor);
        
        //Assert
        expect(mappedOrdersPagination.Orders.length).toBe(20);
        expect(mappedOrdersPagination.NextCursor).toBe('fake-order-id-5678-20');
    });
});