type ProductDto = {
    ID: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    Measure: 'KILO' | 'LITRO' | 'UNIDAD';
    IsActive: boolean;
    Discount?: {
        percentage: number;
        isActive: boolean;
        startDate: Date;
        endDate: Date;
    } | null;
};

export default ProductDto;
