import { OrderItems, Orders } from '../../../prisma/generated/lib/client.js';
import OrderDto from '../../shared/types/Orders/Order.dto.type.js';
import OrdersPaginationDto from '../../shared/types/Orders/OrdersPagination.dto.type.js';

export type OrdersWithItems = Orders & { orderItems: OrderItems[] };

export function mapOrder(data: OrdersWithItems): OrderDto {
    return {
        ID: data.ID,
        UserID: data.UserID,
        CustomerName: data.CustomerName,
        CustomerLastName: data.CustomerLastName,
        CustomerDNI: data.CustomerDNI,
        Total: Number(data.Total),
        CreatedAt: data.CreatedAt,
        Items: data.orderItems.map(
            (item) =>
                ({
                    ID: item.ID,
                    OrderID: item.OrderID,
                    ProductID: item.ProductID,
                    UnitPrice: Number(item.UnitPrice),
                    Qty: Number(item.Qty),
                    SubTotal: Number(item.SubTotal),
                    TotalDiscount: Number(item.TotalDiscount),
                    TotalItem: Number(item.TotalItem),
                }) as unknown as OrderDto['Items'][0]
        ),
    };
}

export function mapOrders(
    data: OrdersWithItems[],
    take: number
): OrdersPaginationDto {
    const hasNextPage = data.length > take;
    const orders = hasNextPage ? data.slice(0, -1) : data;
    const lastOrder = orders[orders.length - 1];

    const pageOrders: OrdersPaginationDto['Orders'] = orders.map((order) => ({
        ID: order.ID,
        UserID: order.UserID,
        CustomerName: order.CustomerName || undefined,
        CustomerLastName: order.CustomerLastName || undefined,
        CustomerDNI: order.CustomerDNI || undefined,
        Total: Number(order.Total),
        CreatedAt: order.CreatedAt,
    }));

    const nextCursor: OrdersPaginationDto['NextCursor'] =
        hasNextPage && lastOrder ? lastOrder.ID : undefined;

    return {
        Orders: pageOrders,
        NextCursor: nextCursor,
    };
}
