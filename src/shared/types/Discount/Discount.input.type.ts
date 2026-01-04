type DiscountInput = {
    ProductID: string;
    Percentage: number;
    ValidFrom: Date;
    ValidTo: Date;
    isActive: boolean;
};

export default DiscountInput;
