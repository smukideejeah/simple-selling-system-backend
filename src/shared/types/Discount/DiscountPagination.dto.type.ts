type DiscountPaginationDto = {
    Discounts: {
        ID: string;
        ProductID: string;
        Percentage: number;
        ValidFrom: Date;
        ValidTo: Date;
        isActive: boolean;
        Product: {
            ID: string;
            Code: string;
            Name: string;
            Description: string;
            Price: number;
            Measure: 'KILO' | 'LITRO' | 'UNIDAD';
            IsActive: boolean;
        };
    }[];
    NextCursor?: {
        ID: string;
    } | null;
};

export default DiscountPaginationDto;
