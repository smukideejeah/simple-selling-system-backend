type DiscountInput = {
    ProductID: string;
    Percentage: number;
    ValidFrom: Date;
    ValidTo: Date;
    IsActive: boolean;
};

export default DiscountInput;
