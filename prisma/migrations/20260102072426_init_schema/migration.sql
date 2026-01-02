-- CreateTable
CREATE TABLE `Users` (
    `ID` CHAR(36) NOT NULL,
    `Username` VARCHAR(50) NOT NULL,
    `Names` VARCHAR(200) NOT NULL,
    `Hash` VARCHAR(250) NOT NULL,
    `Role` VARCHAR(8) NOT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `Users_Username_key`(`Username`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `ID` CHAR(36) NOT NULL,
    `Code` VARCHAR(100) NOT NULL,
    `Name` VARCHAR(200) NOT NULL,
    `Description` TEXT NOT NULL,
    `Price` DECIMAL(12, 2) NOT NULL,
    `Measure` VARCHAR(20) NOT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` TIMESTAMP(6) NOT NULL,
    `DeletedAt` TIMESTAMP(6) NULL,

    UNIQUE INDEX `Products_Code_key`(`Code`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discounts` (
    `ID` CHAR(36) NOT NULL,
    `ProductID` CHAR(36) NOT NULL,
    `Type` VARCHAR(20) NOT NULL,
    `Value` DECIMAL(5, 2) NOT NULL,
    `StartDate` DATETIME(6) NOT NULL,
    `EndDate` DATETIME(6) NOT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `Discounts_ProductID_key`(`ProductID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `ID` CHAR(36) NOT NULL,
    `UserID` CHAR(36) NOT NULL,
    `CustomerName` VARCHAR(200) NULL,
    `CustomerLastName` VARCHAR(200) NULL,
    `CustomerDNI` VARCHAR(20) NULL,
    `Total` DECIMAL(12, 2) NOT NULL,
    `PaymentMethod` VARCHAR(20) NOT NULL,
    `CreatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` TIMESTAMP(6) NOT NULL,

    INDEX `Orders_CreatedAt_idx`(`CreatedAt`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItems` (
    `ID` CHAR(36) NOT NULL,
    `OrderID` CHAR(36) NOT NULL,
    `ProductID` CHAR(36) NOT NULL,
    `UnitPrice` DECIMAL(12, 2) NOT NULL,
    `Qty` DECIMAL(12, 2) NOT NULL,
    `TotalDiscount` DECIMAL(12, 2) NOT NULL,
    `SubTotal` DECIMAL(12, 2) NOT NULL,
    `TotalItem` DECIMAL(12, 2) NOT NULL,
    `CreatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Discounts` ADD CONSTRAINT `Discounts_ProductID_fkey` FOREIGN KEY (`ProductID`) REFERENCES `Products`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_OrderID_fkey` FOREIGN KEY (`OrderID`) REFERENCES `Orders`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_ProductID_fkey` FOREIGN KEY (`ProductID`) REFERENCES `Products`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Check
ALTER TABLE `Users` ADD CONSTRAINT `Users_Role_check` CHECK (`Role` IN ('GESTOR', 'VENDEDOR'));

-- Add Check
ALTER TABLE `Discounts` ADD CONSTRAINT `Discounts_Type_check` CHECK (`Type` = 'PORCENTAJE');

-- Add Check
ALTER TABLE `Discounts` ADD CONSTRAINT `Discounts_Value_check` CHECK (`Value` BETWEEN 0 AND 100);

-- Add Check
ALTER TABLE `Discounts` ADD CONSTRAINT `Discounts_Dates_check` CHECK (`EndDate` >= `StartDate`);

-- Add Check
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_PaymentMethod_check` CHECK (`PaymentMethod` = 'EFECTIVO');

-- Add Check
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_Total_check` CHECK (`Total` >= 0);

-- Add Check
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_UnitPrice_check` CHECK (`UnitPrice` >= 0);

-- Add Check
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_Qty_check` CHECK (`Qty` > 0);

-- Add Check
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_TotalDiscount_check` CHECK (`TotalDiscount` >= 0);

-- Add Check
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_SubTotal_check` CHECK (`SubTotal` >= 0);

-- Add Check
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_TotalItem_check` CHECK (`TotalItem` >= 0);
