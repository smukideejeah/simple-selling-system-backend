type OrdersPaginationDto = {
    Orders: {
        ID: string;
        UserID: string | null;
        CustomerName?: string | null;
        CustomerLastName?: string | null;
        CustomerDNI?: string | null;
        Total: number;
        CreatedAt: Date;
    }[];
    NextCursor?: string;
};

export default OrdersPaginationDto;
