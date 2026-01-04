export type OrderInputInService = {
    UserId: string;
    CustomerName?: string;
    CustomerLastName?: string;
    CustomerDNI?: string;
    Items: {
        ProductID: string;
        Qty: number;
    }[];
};

export default OrderInputInService;
