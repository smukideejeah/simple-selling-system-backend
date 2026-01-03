/*
  Warnings:

  - A unique constraint covering the columns `[ID,Name]` on the table `Products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `Discounts_CreatedAt_idx` ON `Discounts`(`CreatedAt`);

-- CreateIndex
CREATE INDEX `Products_CreatedAt_idx` ON `Products`(`CreatedAt`);

-- CreateIndex
CREATE UNIQUE INDEX `Products_ID_Name_key` ON `Products`(`ID`, `Name`);
