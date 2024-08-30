const prisma = require('../prisma/prisma');
const { mapDriversAttachments } = require("../utils/vehicleConversion")

const getDriverByQuery = async (query) => {
    return await prisma.driver.findFirst({ where: query });
};

const createDriver = async (data, files) => {
    let attachments = []
    if (files && files.attachments) {
        attachments = mapDriversAttachments(files.attachments);
    }

    return await prisma.driver.create({
        data: {
            ...data,
            attachments: {
                create: attachments.map(attachment => ({
                    url: attachment.url?.replaceAll("\\", "/"),
                })),
            },
        },
        include: {
            attachments: true,
        },
    });
};

const getDriverById = async (id) => {
    return await prisma.driver.findUnique({
        where: { id: +id },
        include: {
            attachments: true
        },
    });
};

const updateDriver = async (id, data) => {
    return await prisma.driver.update({
        where: { id: +id },
        data
    });
};

const updateDriverAttachments = async (id, attachments) => {
    return await prisma.driver.update({
        where: { id: +id },
        data: {
            attachments: {
                // deleteMany: {}, // delete all existing docs but i will commit it now
                create: attachments.map(attachment => ({
                    url: attachment.url?.replaceAll("\\", "/"),
                })),
            },
        },
        include: {
            attachments: true,
        },
    });
};

const deleteDriver = async (id) => {
    return await prisma.driver.delete({ where: { id: +id } });
};

const getAllDrivers = async (query) => {
    return await prisma.driver.findMany(query)
};

const bulkCreateDrivers = async (drivers) => {
    return await prisma.driver.createMany({ data: drivers });
};

const deleteDriverAttachments = async (id) => {
    return await prisma.attachment.delete({ where: { id: +id } })
}

const getDriverAttachments = async (id) => {
    return await prisma.attachment.findUnique({ where: { id: +id } })
}

const findDriversByIds = async (ids) => {
    return await prisma.driver.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
};

module.exports = {
    createDriver,
    getDriverById,
    getDriverByQuery,
    updateDriver,
    deleteDriver,
    getAllDrivers,
    bulkCreateDrivers,
    findDriversByIds,
    updateDriverAttachments,
    deleteDriverAttachments,
    getDriverAttachments
};
