// src/models/vehicle.js
const { INTERNAL_SERVER_ERROR } = require('../constants/status-codes');
const prisma = require('../prisma/prisma');
const { buildVehicleQuery } = require('../utils/buildVehicleQuery');
const { CustomError } = require('../utils/error');

const createVehicle = async (data) => {
  try {

    const { attachments, ...vehicleData } = data;

    // Create the vehicle along with its attachments
    const createdVehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        attachments: {
          create: attachments.map(attachment => ({
            url: attachment.url,
          })),
        },
      },
      include: {
        attachments: true,
      },
    });

    return createdVehicle;
  } catch (error) {
    console.log({ error });

    throw new CustomError("Error while create a vehicle", INTERNAL_SERVER_ERROR)
  }
};

const getVehicleById = async (id) => {
  try {

    return await prisma.vehicle.findUnique({
      where: { id: parseInt(id) }, include: {
        attachments: true,
        driver: true
      },
    });
  } catch (error) {
    throw new CustomError("Error While fetch data", INTERNAL_SERVER_ERROR)

  }
};

const getVehicleByQuery = async (query) => {
  return await prisma.vehicle.findUnique({ where: query, include: { attachments: true } });
};

const findVehiclesByIMEIs = async (imeis) => {
  return await prisma.vehicle.findMany({
    where: {
      imei: {
        in: imeis,
      },
    },
  });
};

const updateVehicle = async (id, data) => {
  try {
    return await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data,
      include: { attachments: true }
    });
  } catch (error) {
    throw new CustomError("Error While update data", INTERNAL_SERVER_ERROR)
  }
};

const deleteVehicle = async (id) => {
  try {
    return await prisma.vehicle.delete({ where: { id: parseInt(id) } });
  } catch (error) {
    throw new CustomError("Error While delete data, or vehicle not found", INTERNAL_SERVER_ERROR)
  }
};

const deleteVehicleAttachments = async (vehicleId) => {
  await prisma.vehicleAttachment.deleteMany({
    where: { vehicleId: parseInt(vehicleId) },
  });
};

const deleteVehicleAttachmentById = async (id) => {
  return await prisma.vehicleAttachment.delete({
    where: { id },
  });
};

const createManyAttachments = async (data) => {
  return await prisma.vehicleAttachment.createMany({ data: data });
};

const getVehicleAttachmentById = async (id) => {
  return await prisma.vehicleAttachment.findUnique({
    where: { id: parseInt(id) }
  });
};

const updateVehicleAttachments = async (vehicleId, attachments) => {
  // add new attachments
  return await prisma.vehicle.update({
    where: { id: parseInt(vehicleId) },
    data: {
      attachments: {
        create: attachments.map((attachment) => ({
          url: attachment.url,
        })),
      },
    },
    include: { attachments: true }, // Include attachments in the response
  });
};


const getAllVehicles = async (query) => {
  try {

    const finalQuery = buildVehicleQuery(query);

    const vehicles = await prisma.vehicle.findMany(finalQuery);

    const totalCount = await prisma.vehicle.count({
      where: finalQuery.where,
    });

    let response = {
      vehicles, totalCount,
      currentPage: query.page,
      totalPages: Math.ceil(totalCount / query.limit),
    }

    return response;
  } catch (error) {
    throw new CustomError("Error While Fetch data", INTERNAL_SERVER_ERROR)
  }
};

const bulkCreateVehicles = async (vehicles) => {
  try {
    return await prisma.vehicle.createMany({ data: vehicles });
  } catch (error) {
    throw new CustomError("Error While create data", INTERNAL_SERVER_ERROR)
  }
};

module.exports = {
  createVehicle,
  getVehicleById,
  getVehicleByQuery,
  updateVehicle,
  deleteVehicle,
  deleteVehicleAttachments,
  updateVehicleAttachments,
  getAllVehicles,
  bulkCreateVehicles,
  findVehiclesByIMEIs,
  deleteVehicleAttachmentById,
  getVehicleAttachmentById,
  createManyAttachments
};
