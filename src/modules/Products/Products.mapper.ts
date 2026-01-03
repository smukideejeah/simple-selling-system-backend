import { Discounts, Products } from '../../../prisma/generated/lib/client.js';
import ProductDto from '../../shared/types/Product/Product.dto.type.js';
import ProductsPaginationDto from '../../shared/types/Product/ProductsPagination.dto.type.js';

type ProductsWithDiscount = (Products & { Discount?: Discounts | null }) | null;

export function mapProduct(data: ProductsWithDiscount): ProductDto | null {
    return !data
        ? null
        : {
              ID: data.ID,
              Code: data.Code,
              Name: data.Name,
              Description: data.Description,
              Price: Number(data.Price),
              Measure: data.Measure as 'KILO' | 'LITRO' | 'UNIDAD',
              IsActive: data.IsActive,
              Discount: data.Discount
                  ? {
                        percentage: Number(data.Discount.Value),
                        isActive: data.Discount.IsActive,
                        startDate: data.Discount.StartDate,
                        endDate: data.Discount.EndDate,
                    }
                  : null,
          };
}

export function mapProducts(
    data: ProductsWithDiscount[],
    take: number
): ProductsPaginationDto {
    const hasNextPage = data.length > take;
    const products = hasNextPage ? data.slice(0, -1) : data;
    const lastProduct = products[products.length - 1];

    return {
        Products: products.map((prod) => mapProduct(prod) as ProductDto),
        NextCursor:
            hasNextPage && lastProduct
                ? {
                      ID: lastProduct.ID,
                      Name: lastProduct.Name,
                  }
                : null,
    };
}
