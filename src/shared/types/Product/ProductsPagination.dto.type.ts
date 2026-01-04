type ProductsPaginationDto = {
    Products: {
        ID: string;
        Code: string;
        Name: string;
        Description: string;
        Price: number;
        Measure: 'KILO' | 'LITRO' | 'UNIDAD';
        IsActive: boolean;
    }[];
    NextCursor?: {
        ID: string;
        Name: string;
    } | null;
};

export default ProductsPaginationDto;
