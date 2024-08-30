const { INTERNAL_SERVER_ERROR } = require('../../constants/status-codes');
const { CustomError } = require('../../utils/error');
const traccarClient = require('./auth.service');
const prisma = require("../../prisma/prisma")
const axios = require('axios');
const traccarConfig = require('./auth.service');

const traccarService = axios.create({
    baseURL: traccarConfig.baseURL,
    auth: {
      username: traccarConfig.username,
      password: traccarConfig.password,
    },
  });
  

const createTraccarDriver = async (driver) => {
    try {
        const response = await traccarService.post('/drivers', {
            name:driver.name,
            uniqueId:driver.code,
    
        });
        return response.data;
        // return prisma.tc_drivers.create({ data: { name, uniqueid: String(uniqueid), attributes: JSON.stringify(attributes) } })
    } catch (error) {
        console.error('Error creating driver in Traccar:', error.response?.data || error.message);
        throw new CustomError(error.response?.data || error.message || 'Failed to create driver in Traccar', INTERNAL_SERVER_ERROR);
    }
};

const fetchAllDrivers = async () => {
    try {
        // const response = await traccarClient.get('/drivers');
        // return response.data; // This should be an array of drivers
        return prisma.tc_drivers.findMany({})
    } catch (error) {
        console.error('Error fetching drivers from Traccar:', error.response?.data || error.message);
        throw new CustomError('Failed to fetch drivers from Traccar', INTERNAL_SERVER_ERROR);
    }
};

const fetchDriverByUniqueId = async (uniqueid) => {
    return prisma.tc_drivers.findUnique({ where: { uniqueid } })
};

const createMultipleDriversConcurrently = async (drivers) => {
    try {
        return prisma.tc_drivers.createMany({
            data: drivers.map(driver => {
                return {
                    name: driver.name,
                    uniqueid: String(driver.id),
                    attributes: JSON.stringify(driver)
                }
            })
        })
    } catch (error) {
        console.error('Error creating some drivers:', error.response?.data || error.message);
        throw new CustomError(`Error creating some drivers in Traccar`, INTERNAL_SERVER_ERROR);
    }
};

const deleteTraccarDriver = async (driverId) => {
    try {
        await traccarService.delete(`/drivers/${driverId}`);
        // return prisma.tc_drivers.delete({ where: { id: driverId } })
    } catch (error) {
        console.error(`Error deleting driver with ID ${driverId}:`, error.response?.data || error.message);
        throw new CustomError(`Failed to delete driver with ID ${driverId}`, INTERNAL_SERVER_ERROR);
    }
};

const updateTraccarDriverByUniqueId = async (driverId, updatedData) => {
    try {
        let data = { attributes: JSON.stringify(updatedData) }
        if (updatedData.name) data.name = updatedData.name

        return prisma.tc_drivers.update({ where: { uniqueid: driverId }, data })
    } catch (error) {
        console.error(`Error updating driver with ID ${driverId}:`, error.response?.data || error.message);
        throw new CustomError(`Failed to update driver with ID ${driverId}`, INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    createTraccarDriver,
    fetchAllDrivers,
    updateTraccarDriverByUniqueId,
    createMultipleDriversConcurrently,
    fetchDriverByUniqueId,
    deleteTraccarDriver,
}