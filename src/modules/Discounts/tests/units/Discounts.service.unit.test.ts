import { Decimal } from '@prisma/client/runtime/client';
import DiscountsService from '../../Discounts.service';
import { Prisma } from '../../../../../prisma/generated/lib/client';
import {jest} from '@jest/globals';

describe('Testing the most important methods of DiscountsService', () => {
        let repository: {
            findById: jest.Mock<any>;
            findProductById: jest.Mock<any>;
            findAll: jest.Mock<any>;
            create: jest.Mock<any>;
            update: jest.Mock<any>;
            delete: jest.Mock<any>;
        };
    
        let service: DiscountsService;
    
        beforeEach(() => {
            repository = {
                findById: jest.fn(),
                findProductById: jest.fn(),
                findAll: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            };
    
            service = new DiscountsService(repository as any);
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should  create a discount successfully', async () => {
            //Arrange
            const discountInput = {
                ProductID: '123e4567-e89b-12d3-a456-426614174000',
                Percentage: 15,
                ValidFrom: new Date('2024-01-01'),
                ValidTo: new Date('2024-01-31'),
                isActive: true,
            };

            const discountData = {
                ID: '123e4567-e89b-12d3-a456-426614174000',
                IsActive: true,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                ProductID: '223e4567-e89b-12d3-a456-426614174000',
                Value: new Decimal('15'),
                Type: 'PORCENTAJE',
                StartDate: new Date('2024-01-01'),
                EndDate: new Date('2024-12-31'),
                product: {
                    ID: '223e4567-e89b-12d3-a456-426614174000',
                    Code: 'PROD001',
                    Name: 'Test Product',
                    Description: 'This is a test product',
                    Price: new Decimal('100'),
                    Measure: 'UNIDAD',
                    IsActive: true,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                    DeletedAt: null,
                },
            };
            
            //Act
            repository.findProductById.mockResolvedValue(null);
            repository.create.mockResolvedValue(discountData);
            const result = await service.create(discountInput);

            //Assert
            expect(repository.findProductById).toHaveBeenCalledWith(discountInput.ProductID);
            expect(repository.create).toHaveBeenCalled();
            expect(result).not.toBeNull();
        });

        it('should NOT create a discount if product already has one', async () => {
            //Arrange
            const discountInput = {
                ProductID: '123e4567-e89b-12d3-a456-426614174000',
                Percentage: 15,
                ValidFrom: new Date('2024-01-01'),
                ValidTo: new Date('2024-01-31'),
                isActive: true,
            };

            const productWithDiscount = {
                ID: '123e4567-e89b-12d3-a456-426614174000',
                Code: 'PROD001',
                Name: 'Test Product',
                Description: 'This is a test product',
                Price: new Decimal('100'),
                Measure: 'UNIDAD',
                IsActive: true,
                Discount: {
                    percentage: 10,
                    startDate: new Date('2023-12-01'),
                    endDate: new Date('2023-12-31'),
                    isActive: false,
                },
            };

            const expectedResult = null;
            
            //Act
            repository.findProductById.mockResolvedValue(productWithDiscount);
            const result = await service.create(discountInput);

            //Assert
            expect(repository.findProductById).toHaveBeenCalledWith(discountInput.ProductID);
            expect(repository.create).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should update a non-existing discount (failure case)', async () => {
            //Arrange
            const discountId = 'non-existing-id';
            const updateData = {
                Percentage: 20,
            };

            const expectedResult = null;

            //Act
            //update throws Prisma error
            repository.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Record not found', {
                code: 'P2025',
                clientVersion: '7.2.0',
            }));
            const result = await service.update(discountId, updateData);

            //Assert
            expect(repository.update).toHaveBeenCalledWith(discountId, updateData);
            expect(result).toEqual(expectedResult);
        });


        it('should delete a non-existing discount (failure case)', async () => {
            //Arrange
            const discountId = 'non-existing-id';

            const expectedResult = false;

            //Act
            //delete throws Prisma error
            repository.delete.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Record not found', {
                code: 'P2025',
                clientVersion: '7.2.0',
            }));
            const result = await service.delete(discountId);

            //Assert
            expect(repository.delete).toHaveBeenCalledWith(discountId);
            expect(result).toEqual(expectedResult);
        });

        it('should get a non-existing discount by ID (failure case)', async () => {
            //Arrange
            const discountId = 'non-existing-id';

            //Act
            repository.findById.mockResolvedValue(null);
            const result = await service.getById(discountId);

            //Assert
            expect(repository.findById).toHaveBeenCalledWith(discountId);
            expect(result).toBeNull();
        });
});