// src/utils/queryBuilder.js

const { Prisma } = require("@prisma/client");

const buildVehicleQuery = ({ search = '', sortBy, sortOrder, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Build orderBy clause if sorting parameters are provided
  const orderBy = {};
  if (sortBy && sortOrder) {
    orderBy[sortBy] = sortOrder;
  }

  // Build where clause if a search query is provided
  const where = search
    ? {
      OR: [
        { name: { contains: search } },
        { imei: { contains: search } },
        { model: { contains: search } },
        { plateNumber: { contains: search } },
        { vehicleType: { contains: search } },
        { code: { contains: search } },
        { registrationNumber: { contains: search } },
      ],
    }
    : {};

  // Return the Prisma query object
  return {
    where: search ? where : {},
    orderBy: sortBy ? orderBy : undefined,
    skip: limit ? skip : undefined,
    take: limit ? limit : undefined,
    include: {
      attachments: true,
      driver: true
    },
  };
};

const buildDriverQuery = (page = 1, pageSize = 10, sortBy, sortOrder, search, fields) => {
  let query = {
    include: {
      attachments: true
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: sortBy ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' } : {},
  }

  if (!search || !Array.isArray(fields) || fields.length === 0) return query
  const orConditions = fields.map(field => ({
    [field]: { contains: search }
  }));

  return {
    ...query,
    where: {
      OR: orConditions,
    },
  };
};

module.exports = {
  buildVehicleQuery,
  buildDriverQuery
};
