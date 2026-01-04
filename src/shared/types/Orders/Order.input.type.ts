export type OrderInput = {
    UserId: string;
    CustomerName?: string;
    CustomerLastName?: string;
    CustomerDNI?: string;
    Total: number;
    Items: {
        ProductID: string;
        UnitPrice: number;
        Qty: number;
        SubTotal: number;
        TotalDiscount: number;
        TotalItem: number;
    }[];
};

export default OrderInput;
