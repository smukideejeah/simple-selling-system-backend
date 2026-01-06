type ProductDto = {
    ID: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    Measure: 'KILO' | 'LITRO' | 'UNIDAD';
    IsActive: boolean;
    Discount?: {
        Percentage: number;
        IsActive: boolean;
        StartDate: Date;
        EndDate: Date;
    } | null;
};

export default ProductDto;
