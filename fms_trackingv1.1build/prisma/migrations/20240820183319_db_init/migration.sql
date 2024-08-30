-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `imei` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `fuelConsumption` DOUBLE NULL,
    `fuelCost` DOUBLE NULL,
    `vehicleType` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `vin` VARCHAR(191) NULL,
    `licenseExpire` VARCHAR(191) NULL,
    `licenseExpireReminder` BOOLEAN NULL,
    `simNumber` VARCHAR(191) NOT NULL,
    `simNumberSerial` VARCHAR(191) NULL,
    `odometer` DOUBLE NULL,
    `brand` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `vehicleExpires` VARCHAR(191) NOT NULL,
    `parent` INTEGER NOT NULL,
    `accSupport` BOOLEAN NOT NULL,
    `fuelSupport` BOOLEAN NOT NULL,
    `fuelCapacity` DOUBLE NULL,
    `tankHeight` DOUBLE NULL,
    `tankWidth` DOUBLE NULL,
    `tankLength` DOUBLE NULL,
    `doorSupport` BOOLEAN NOT NULL,
    `weightSensorSupport` BOOLEAN NULL,
    `temperatureSensorSupport` BOOLEAN NULL,
    `iButtonSensorSupport` BOOLEAN NULL,
    `ptoSensorSupport` BOOLEAN NULL,
    `seatSensorSupport` BOOLEAN NULL,
    `refrigeratorSensorSupport` BOOLEAN NULL,
    `headlightsSensorSupport` BOOLEAN NULL,
    `idleTime` DOUBLE NULL,
    `idleAlert` BOOLEAN NULL,
    `archived` BOOLEAN NULL,
    `department` INTEGER NULL,
    `driverId` INTEGER NULL,
    `icon` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vehicle_imei_key`(`imei`),
    INDEX `Vehicle_driverId_fkey`(`driverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `idNo` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `emergencyPhoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `licenseNo` VARCHAR(191) NOT NULL,
    `licenseStartDate` DATETIME(3) NOT NULL,
    `licenseExpireDate` DATETIME(3) NULL,
    `licenseExpireReminder` BOOLEAN NULL DEFAULT false,
    `contractStartDate` DATETIME(3) NOT NULL,
    `contractExpireDate` DATETIME(3) NULL,
    `contractExpireReminder` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `Driver_code_key`(`code`),
    UNIQUE INDEX `Driver_idNo_key`(`idNo`),
    UNIQUE INDEX `Driver_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `Driver_licenseNo_key`(`licenseNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `driverId` INTEGER NOT NULL,

    INDEX `Attachment_driverId_fkey`(`driverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleAttachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `vehicleId` INTEGER NOT NULL,

    INDEX `VehicleAttachment_vehicleId_fkey`(`vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DATABASECHANGELOG` (
    `ID` VARCHAR(255) NOT NULL,
    `AUTHOR` VARCHAR(255) NOT NULL,
    `FILENAME` VARCHAR(255) NOT NULL,
    `DATEEXECUTED` DATETIME(0) NOT NULL,
    `ORDEREXECUTED` INTEGER NOT NULL,
    `EXECTYPE` VARCHAR(10) NOT NULL,
    `MD5SUM` VARCHAR(35) NULL,
    `DESCRIPTION` VARCHAR(255) NULL,
    `COMMENTS` VARCHAR(255) NULL,
    `TAG` VARCHAR(255) NULL,
    `LIQUIBASE` VARCHAR(20) NULL,
    `CONTEXTS` VARCHAR(255) NULL,
    `LABELS` VARCHAR(255) NULL,
    `DEPLOYMENT_ID` VARCHAR(10) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DATABASECHANGELOGLOCK` (
    `ID` INTEGER NOT NULL,
    `LOCKED` BIT(1) NOT NULL,
    `LOCKGRANTED` DATETIME(0) NULL,
    `LOCKEDBY` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_attributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(4000) NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `attribute` VARCHAR(128) NOT NULL,
    `expression` VARCHAR(4000) NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_calendars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `data` MEDIUMBLOB NOT NULL,
    `attributes` VARCHAR(4000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_commands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(4000) NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `textchannel` BIT(1) NOT NULL DEFAULT b'0',
    `attributes` VARCHAR(4000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_commands_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceid` INTEGER NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `textchannel` BIT(1) NOT NULL DEFAULT b'0',
    `attributes` VARCHAR(4000) NOT NULL,

    INDEX `idx_commands_queue_deviceid`(`deviceid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_attribute` (
    `deviceid` INTEGER NOT NULL,
    `attributeid` INTEGER NOT NULL,

    INDEX `fk_user_device_attribute_attributeid`(`attributeid`),
    INDEX `fk_user_device_attribute_deviceid`(`deviceid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_command` (
    `deviceid` INTEGER NOT NULL,
    `commandid` INTEGER NOT NULL,

    INDEX `fk_device_command_commandid`(`commandid`),
    INDEX `fk_device_command_deviceid`(`deviceid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_driver` (
    `deviceid` INTEGER NOT NULL,
    `driverid` INTEGER NOT NULL,

    INDEX `fk_device_driver_deviceid`(`deviceid`),
    INDEX `fk_device_driver_driverid`(`driverid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_geofence` (
    `deviceid` INTEGER NOT NULL,
    `geofenceid` INTEGER NOT NULL,

    INDEX `fk_device_geofence_deviceid`(`deviceid`),
    INDEX `fk_device_geofence_geofenceid`(`geofenceid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_maintenance` (
    `deviceid` INTEGER NOT NULL,
    `maintenanceid` INTEGER NOT NULL,

    INDEX `fk_device_maintenance_deviceid`(`deviceid`),
    INDEX `fk_device_maintenance_maintenanceid`(`maintenanceid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_notification` (
    `deviceid` INTEGER NOT NULL,
    `notificationid` INTEGER NOT NULL,

    INDEX `fk_device_notification_deviceid`(`deviceid`),
    INDEX `fk_device_notification_notificationid`(`notificationid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_order` (
    `deviceid` INTEGER NOT NULL,
    `orderid` INTEGER NOT NULL,

    INDEX `fk_device_order_deviceid`(`deviceid`),
    INDEX `fk_device_order_orderid`(`orderid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_device_report` (
    `deviceid` INTEGER NOT NULL,
    `reportid` INTEGER NOT NULL,

    INDEX `fk_device_report_deviceid`(`deviceid`),
    INDEX `fk_device_report_reportid`(`reportid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `uniqueid` VARCHAR(128) NOT NULL,
    `lastupdate` TIMESTAMP(0) NULL,
    `positionid` INTEGER NULL,
    `groupid` INTEGER NULL,
    `attributes` VARCHAR(4000) NULL,
    `phone` VARCHAR(128) NULL,
    `model` VARCHAR(128) NULL,
    `contact` VARCHAR(512) NULL,
    `category` VARCHAR(128) NULL,
    `disabled` BIT(1) NULL DEFAULT b'0',
    `status` CHAR(8) NULL,
    `expirationtime` TIMESTAMP(0) NULL,
    `motionstate` BIT(1) NULL DEFAULT b'0',
    `motiontime` TIMESTAMP(0) NULL,
    `motiondistance` DOUBLE NULL DEFAULT 0,
    `overspeedstate` BIT(1) NULL DEFAULT b'0',
    `overspeedtime` TIMESTAMP(0) NULL,
    `overspeedgeofenceid` INTEGER NULL DEFAULT 0,
    `motionstreak` BIT(1) NULL DEFAULT b'0',
    `calendarid` INTEGER NULL,

    UNIQUE INDEX `uniqueid`(`uniqueid`),
    INDEX `fk_devices_calendarid`(`calendarid`),
    INDEX `fk_devices_groupid`(`groupid`),
    INDEX `idx_devices_uniqueid`(`uniqueid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_drivers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `uniqueid` VARCHAR(128) NOT NULL,
    `attributes` VARCHAR(4000) NOT NULL,

    UNIQUE INDEX `uniqueid`(`uniqueid`),
    INDEX `idx_drivers_uniqueid`(`uniqueid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(128) NOT NULL,
    `eventtime` TIMESTAMP(0) NULL,
    `deviceid` INTEGER NULL,
    `positionid` INTEGER NULL,
    `geofenceid` INTEGER NULL,
    `attributes` VARCHAR(4000) NULL,
    `maintenanceid` INTEGER NULL,

    INDEX `event_deviceid_servertime`(`deviceid`, `eventtime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_geofences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `description` VARCHAR(128) NULL,
    `area` VARCHAR(4096) NOT NULL,
    `attributes` VARCHAR(4000) NULL,
    `calendarid` INTEGER NULL,

    INDEX `fk_geofence_calendar_calendarid`(`calendarid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_attribute` (
    `groupid` INTEGER NOT NULL,
    `attributeid` INTEGER NOT NULL,

    INDEX `fk_group_attribute_attributeid`(`attributeid`),
    INDEX `fk_group_attribute_groupid`(`groupid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_command` (
    `groupid` INTEGER NOT NULL,
    `commandid` INTEGER NOT NULL,

    INDEX `fk_group_command_commandid`(`commandid`),
    INDEX `fk_group_command_groupid`(`groupid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_driver` (
    `groupid` INTEGER NOT NULL,
    `driverid` INTEGER NOT NULL,

    INDEX `fk_group_driver_driverid`(`driverid`),
    INDEX `fk_group_driver_groupid`(`groupid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_geofence` (
    `groupid` INTEGER NOT NULL,
    `geofenceid` INTEGER NOT NULL,

    INDEX `fk_group_geofence_geofenceid`(`geofenceid`),
    INDEX `fk_group_geofence_groupid`(`groupid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_maintenance` (
    `groupid` INTEGER NOT NULL,
    `maintenanceid` INTEGER NOT NULL,

    INDEX `fk_group_maintenance_groupid`(`groupid`),
    INDEX `fk_group_maintenance_maintenanceid`(`maintenanceid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_notification` (
    `groupid` INTEGER NOT NULL,
    `notificationid` INTEGER NOT NULL,

    INDEX `fk_group_notification_groupid`(`groupid`),
    INDEX `fk_group_notification_notificationid`(`notificationid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_order` (
    `groupid` INTEGER NOT NULL,
    `orderid` INTEGER NOT NULL,

    INDEX `fk_group_order_groupid`(`groupid`),
    INDEX `fk_group_order_orderid`(`orderid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_group_report` (
    `groupid` INTEGER NOT NULL,
    `reportid` INTEGER NOT NULL,

    INDEX `fk_group_report_groupid`(`groupid`),
    INDEX `fk_group_report_reportid`(`reportid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `groupid` INTEGER NULL,
    `attributes` VARCHAR(4000) NULL,

    INDEX `fk_groups_groupid`(`groupid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_keystore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publickey` MEDIUMBLOB NOT NULL,
    `privatekey` MEDIUMBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_maintenances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(4000) NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `start` DOUBLE NOT NULL DEFAULT 0,
    `period` DOUBLE NOT NULL DEFAULT 0,
    `attributes` VARCHAR(4000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(128) NOT NULL,
    `attributes` VARCHAR(4000) NULL,
    `always` BIT(1) NOT NULL DEFAULT b'0',
    `calendarid` INTEGER NULL,
    `notificators` VARCHAR(128) NULL,
    `commandid` INTEGER NULL,

    INDEX `fk_notification_calendar_calendarid`(`calendarid`),
    INDEX `fk_notifications_commandid`(`commandid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uniqueid` VARCHAR(128) NOT NULL,
    `description` VARCHAR(512) NULL,
    `fromaddress` VARCHAR(512) NULL,
    `toaddress` VARCHAR(512) NULL,
    `attributes` VARCHAR(4000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `protocol` VARCHAR(128) NULL,
    `deviceid` INTEGER NOT NULL,
    `servertime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `devicetime` TIMESTAMP(0) NOT NULL,
    `fixtime` TIMESTAMP(0) NOT NULL,
    `valid` BIT(1) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `altitude` FLOAT NOT NULL,
    `speed` FLOAT NOT NULL,
    `course` FLOAT NOT NULL,
    `address` VARCHAR(512) NULL,
    `attributes` VARCHAR(4000) NULL,
    `accuracy` DOUBLE NOT NULL DEFAULT 0,
    `network` VARCHAR(4000) NULL,
    `geofenceids` VARCHAR(128) NULL,

    INDEX `position_deviceid_fixtime`(`deviceid`, `fixtime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(32) NOT NULL,
    `description` VARCHAR(128) NOT NULL,
    `calendarid` INTEGER NOT NULL,
    `attributes` VARCHAR(4000) NOT NULL,

    INDEX `fk_reports_calendarid`(`calendarid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_servers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration` BIT(1) NOT NULL DEFAULT b'0',
    `latitude` DOUBLE NOT NULL DEFAULT 0,
    `longitude` DOUBLE NOT NULL DEFAULT 0,
    `zoom` INTEGER NOT NULL DEFAULT 0,
    `map` VARCHAR(128) NULL,
    `bingkey` VARCHAR(128) NULL,
    `mapurl` VARCHAR(512) NULL,
    `readonly` BIT(1) NOT NULL DEFAULT b'0',
    `attributes` VARCHAR(4000) NULL,
    `forcesettings` BIT(1) NOT NULL DEFAULT b'0',
    `coordinateformat` VARCHAR(128) NULL,
    `devicereadonly` BIT(1) NULL DEFAULT b'0',
    `limitcommands` BIT(1) NULL DEFAULT b'0',
    `poilayer` VARCHAR(512) NULL,
    `announcement` VARCHAR(4000) NULL,
    `disablereports` BIT(1) NULL DEFAULT b'0',
    `overlayurl` VARCHAR(512) NULL,
    `fixedemail` BIT(1) NULL DEFAULT b'0',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_statistics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capturetime` TIMESTAMP(0) NOT NULL,
    `activeusers` INTEGER NOT NULL DEFAULT 0,
    `activedevices` INTEGER NOT NULL DEFAULT 0,
    `requests` INTEGER NOT NULL DEFAULT 0,
    `messagesreceived` INTEGER NOT NULL DEFAULT 0,
    `messagesstored` INTEGER NOT NULL DEFAULT 0,
    `attributes` VARCHAR(4096) NOT NULL,
    `mailsent` INTEGER NOT NULL DEFAULT 0,
    `smssent` INTEGER NOT NULL DEFAULT 0,
    `geocoderrequests` INTEGER NOT NULL DEFAULT 0,
    `geolocationrequests` INTEGER NOT NULL DEFAULT 0,
    `protocols` VARCHAR(4096) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_attribute` (
    `userid` INTEGER NOT NULL,
    `attributeid` INTEGER NOT NULL,

    INDEX `fk_user_attribute_attributeid`(`attributeid`),
    INDEX `fk_user_attribute_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_calendar` (
    `userid` INTEGER NOT NULL,
    `calendarid` INTEGER NOT NULL,

    INDEX `fk_user_calendar_calendarid`(`calendarid`),
    INDEX `fk_user_calendar_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_command` (
    `userid` INTEGER NOT NULL,
    `commandid` INTEGER NOT NULL,

    INDEX `fk_user_command_commandid`(`commandid`),
    INDEX `fk_user_command_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_device` (
    `userid` INTEGER NOT NULL,
    `deviceid` INTEGER NOT NULL,

    INDEX `fk_user_device_deviceid`(`deviceid`),
    INDEX `user_device_user_id`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_driver` (
    `userid` INTEGER NOT NULL,
    `driverid` INTEGER NOT NULL,

    INDEX `fk_user_driver_driverid`(`driverid`),
    INDEX `fk_user_driver_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_geofence` (
    `userid` INTEGER NOT NULL,
    `geofenceid` INTEGER NOT NULL,

    INDEX `fk_user_geofence_geofenceid`(`geofenceid`),
    INDEX `fk_user_geofence_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_group` (
    `userid` INTEGER NOT NULL,
    `groupid` INTEGER NOT NULL,

    INDEX `fk_user_group_groupid`(`groupid`),
    INDEX `fk_user_group_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_maintenance` (
    `userid` INTEGER NOT NULL,
    `maintenanceid` INTEGER NOT NULL,

    INDEX `fk_user_maintenance_maintenanceid`(`maintenanceid`),
    INDEX `fk_user_maintenance_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_notification` (
    `userid` INTEGER NOT NULL,
    `notificationid` INTEGER NOT NULL,

    INDEX `fk_user_notification_notificationid`(`notificationid`),
    INDEX `fk_user_notification_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_order` (
    `userid` INTEGER NOT NULL,
    `orderid` INTEGER NOT NULL,

    INDEX `fk_user_order_orderid`(`orderid`),
    INDEX `fk_user_order_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_report` (
    `userid` INTEGER NOT NULL,
    `reportid` INTEGER NOT NULL,

    INDEX `fk_user_report_reportid`(`reportid`),
    INDEX `fk_user_report_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_user_user` (
    `userid` INTEGER NOT NULL,
    `manageduserid` INTEGER NOT NULL,

    INDEX `fk_user_user_manageduserid`(`manageduserid`),
    INDEX `fk_user_user_userid`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tc_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `email` VARCHAR(128) NOT NULL,
    `hashedpassword` VARCHAR(128) NULL,
    `salt` VARCHAR(128) NULL,
    `readonly` BIT(1) NOT NULL DEFAULT b'0',
    `administrator` BIT(1) NULL,
    `map` VARCHAR(128) NULL,
    `latitude` DOUBLE NOT NULL DEFAULT 0,
    `longitude` DOUBLE NOT NULL DEFAULT 0,
    `zoom` INTEGER NOT NULL DEFAULT 0,
    `attributes` VARCHAR(4000) NULL,
    `coordinateformat` VARCHAR(128) NULL,
    `disabled` BIT(1) NULL DEFAULT b'0',
    `expirationtime` TIMESTAMP(0) NULL,
    `devicelimit` INTEGER NULL DEFAULT -1,
    `userlimit` INTEGER NULL DEFAULT 0,
    `devicereadonly` BIT(1) NULL DEFAULT b'0',
    `phone` VARCHAR(128) NULL,
    `limitcommands` BIT(1) NULL DEFAULT b'0',
    `login` VARCHAR(128) NULL,
    `poilayer` VARCHAR(512) NULL,
    `disablereports` BIT(1) NULL DEFAULT b'0',
    `fixedemail` BIT(1) NULL DEFAULT b'0',
    `totpkey` VARCHAR(64) NULL,
    `temporary` BIT(1) NULL DEFAULT b'0',

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_users_email`(`email`),
    INDEX `idx_users_login`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleAttachment` ADD CONSTRAINT `VehicleAttachment_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tc_commands_queue` ADD CONSTRAINT `fk_commands_queue_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_attribute` ADD CONSTRAINT `fk_user_device_attribute_attributeid` FOREIGN KEY (`attributeid`) REFERENCES `tc_attributes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_attribute` ADD CONSTRAINT `fk_user_device_attribute_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_command` ADD CONSTRAINT `fk_device_command_commandid` FOREIGN KEY (`commandid`) REFERENCES `tc_commands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_command` ADD CONSTRAINT `fk_device_command_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_driver` ADD CONSTRAINT `fk_device_driver_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_driver` ADD CONSTRAINT `fk_device_driver_driverid` FOREIGN KEY (`driverid`) REFERENCES `tc_drivers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_geofence` ADD CONSTRAINT `fk_device_geofence_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_geofence` ADD CONSTRAINT `fk_device_geofence_geofenceid` FOREIGN KEY (`geofenceid`) REFERENCES `tc_geofences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_maintenance` ADD CONSTRAINT `fk_device_maintenance_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_maintenance` ADD CONSTRAINT `fk_device_maintenance_maintenanceid` FOREIGN KEY (`maintenanceid`) REFERENCES `tc_maintenances`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_notification` ADD CONSTRAINT `fk_device_notification_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_notification` ADD CONSTRAINT `fk_device_notification_notificationid` FOREIGN KEY (`notificationid`) REFERENCES `tc_notifications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_order` ADD CONSTRAINT `fk_device_order_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_order` ADD CONSTRAINT `fk_device_order_orderid` FOREIGN KEY (`orderid`) REFERENCES `tc_orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_report` ADD CONSTRAINT `fk_device_report_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_device_report` ADD CONSTRAINT `fk_device_report_reportid` FOREIGN KEY (`reportid`) REFERENCES `tc_reports`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_devices` ADD CONSTRAINT `fk_devices_calendarid` FOREIGN KEY (`calendarid`) REFERENCES `tc_calendars`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tc_devices` ADD CONSTRAINT `fk_devices_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_geofences` ADD CONSTRAINT `fk_geofence_calendar_calendarid` FOREIGN KEY (`calendarid`) REFERENCES `tc_calendars`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_attribute` ADD CONSTRAINT `fk_group_attribute_attributeid` FOREIGN KEY (`attributeid`) REFERENCES `tc_attributes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_attribute` ADD CONSTRAINT `fk_group_attribute_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_command` ADD CONSTRAINT `fk_group_command_commandid` FOREIGN KEY (`commandid`) REFERENCES `tc_commands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_command` ADD CONSTRAINT `fk_group_command_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_driver` ADD CONSTRAINT `fk_group_driver_driverid` FOREIGN KEY (`driverid`) REFERENCES `tc_drivers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_driver` ADD CONSTRAINT `fk_group_driver_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_geofence` ADD CONSTRAINT `fk_group_geofence_geofenceid` FOREIGN KEY (`geofenceid`) REFERENCES `tc_geofences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_geofence` ADD CONSTRAINT `fk_group_geofence_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_maintenance` ADD CONSTRAINT `fk_group_maintenance_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_maintenance` ADD CONSTRAINT `fk_group_maintenance_maintenanceid` FOREIGN KEY (`maintenanceid`) REFERENCES `tc_maintenances`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_notification` ADD CONSTRAINT `fk_group_notification_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_notification` ADD CONSTRAINT `fk_group_notification_notificationid` FOREIGN KEY (`notificationid`) REFERENCES `tc_notifications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_order` ADD CONSTRAINT `fk_group_order_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_order` ADD CONSTRAINT `fk_group_order_orderid` FOREIGN KEY (`orderid`) REFERENCES `tc_orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_report` ADD CONSTRAINT `fk_group_report_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_group_report` ADD CONSTRAINT `fk_group_report_reportid` FOREIGN KEY (`reportid`) REFERENCES `tc_reports`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_groups` ADD CONSTRAINT `fk_groups_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tc_notifications` ADD CONSTRAINT `fk_notification_calendar_calendarid` FOREIGN KEY (`calendarid`) REFERENCES `tc_calendars`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tc_notifications` ADD CONSTRAINT `fk_notifications_commandid` FOREIGN KEY (`commandid`) REFERENCES `tc_commands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_reports` ADD CONSTRAINT `fk_reports_calendarid` FOREIGN KEY (`calendarid`) REFERENCES `tc_calendars`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_attribute` ADD CONSTRAINT `fk_user_attribute_attributeid` FOREIGN KEY (`attributeid`) REFERENCES `tc_attributes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_attribute` ADD CONSTRAINT `fk_user_attribute_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_calendar` ADD CONSTRAINT `fk_user_calendar_calendarid` FOREIGN KEY (`calendarid`) REFERENCES `tc_calendars`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_calendar` ADD CONSTRAINT `fk_user_calendar_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_command` ADD CONSTRAINT `fk_user_command_commandid` FOREIGN KEY (`commandid`) REFERENCES `tc_commands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_command` ADD CONSTRAINT `fk_user_command_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_device` ADD CONSTRAINT `fk_user_device_deviceid` FOREIGN KEY (`deviceid`) REFERENCES `tc_devices`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_device` ADD CONSTRAINT `fk_user_device_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_driver` ADD CONSTRAINT `fk_user_driver_driverid` FOREIGN KEY (`driverid`) REFERENCES `tc_drivers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_driver` ADD CONSTRAINT `fk_user_driver_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_geofence` ADD CONSTRAINT `fk_user_geofence_geofenceid` FOREIGN KEY (`geofenceid`) REFERENCES `tc_geofences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_geofence` ADD CONSTRAINT `fk_user_geofence_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_group` ADD CONSTRAINT `fk_user_group_groupid` FOREIGN KEY (`groupid`) REFERENCES `tc_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_group` ADD CONSTRAINT `fk_user_group_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_maintenance` ADD CONSTRAINT `fk_user_maintenance_maintenanceid` FOREIGN KEY (`maintenanceid`) REFERENCES `tc_maintenances`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_maintenance` ADD CONSTRAINT `fk_user_maintenance_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_notification` ADD CONSTRAINT `fk_user_notification_notificationid` FOREIGN KEY (`notificationid`) REFERENCES `tc_notifications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_notification` ADD CONSTRAINT `fk_user_notification_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_order` ADD CONSTRAINT `fk_user_order_orderid` FOREIGN KEY (`orderid`) REFERENCES `tc_orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_order` ADD CONSTRAINT `fk_user_order_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_report` ADD CONSTRAINT `fk_user_report_reportid` FOREIGN KEY (`reportid`) REFERENCES `tc_reports`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_report` ADD CONSTRAINT `fk_user_report_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_user` ADD CONSTRAINT `fk_user_user_manageduserid` FOREIGN KEY (`manageduserid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tc_user_user` ADD CONSTRAINT `fk_user_user_userid` FOREIGN KEY (`userid`) REFERENCES `tc_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
