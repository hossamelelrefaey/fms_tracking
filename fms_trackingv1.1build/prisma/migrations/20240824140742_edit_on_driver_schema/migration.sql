-- AlterTable
ALTER TABLE `driver` MODIFY `code` VARCHAR(191) NULL,
    MODIFY `idNo` VARCHAR(191) NULL,
    MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `licenseStartDate` DATETIME(3) NULL,
    MODIFY `contractStartDate` DATETIME(3) NULL;
