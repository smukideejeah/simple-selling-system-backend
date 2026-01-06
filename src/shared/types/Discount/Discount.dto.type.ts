type DiscountDto = {
    ID: string;
    ProductID: string;
    Percentage: number;
    ValidFrom: Date;
    ValidTo: Date;
    IsActive: boolean;
    Product: {
        ID: string;
        Code: string;
        Name: string;
        Description: string;
        Price: number;
        Measure: 'KILO' | 'LITRO' | 'UNIDAD';
        IsActive: boolean;
    };
};

export default DiscountDto;
