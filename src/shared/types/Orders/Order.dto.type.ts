type OrderDto = {
    ID: string;
    UserID: string;
    CustomerName?: string | null;
    CustomerLastName?: string | null;
    CustomerDNI?: string | null;
    Total: number;
    CreatedAt: Date;
    Items: {
        ProductID: string;
        UnitPrice: number;
        Qty: number;
        SubTotal: number;
        TotalDiscount: number;
        TotalItem: number;
    }[];
};

export default OrderDto;
