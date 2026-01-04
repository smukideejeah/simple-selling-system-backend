import { Discounts, Products } from '../../../prisma/generated/lib/client.js';
import DiscountDto from '../../shared/types/Discount/Discount.dto.type.js';
import DiscountPaginationDto from '../../shared/types/Discount/DiscountPagination.dto.type.js';

type DiscountsWithProduct = Discounts & { Product: Products };

export function mapDiscount(data: DiscountsWithProduct): DiscountDto {
    return {
        ID: data.ID,
        ProductID: data.ProductID,
        Percentage: Number(data.Value),
        ValidFrom: data.StartDate,
        ValidTo: data.EndDate,
        isActive: data.IsActive,
        Product: {
            ID: data.Product.ID,
            Code: data.Product.Code,
            Name: data.Product.Name,
            Description: data.Product.Description,
            Price: Number(data.Product.Price),
            Measure: data.Product.Measure as 'KILO' | 'LITRO' | 'UNIDAD',
            IsActive: data.Product.IsActive,
        },
    };
}

export function mapDiscounts(
    data: DiscountsWithProduct[],
    take: number
): DiscountPaginationDto {
    const hasNextPage = data.length > take;
    const discounts = hasNextPage ? data.slice(0, -1) : data;
    const lastDiscount = discounts[discounts.length - 1];

    return {
        Discounts: discounts.map((prod) => mapDiscount(prod)),
        NextCursor:
            hasNextPage && lastDiscount
                ? {
                      ID: lastDiscount.ID,
                  }
                : null,
    };
}
