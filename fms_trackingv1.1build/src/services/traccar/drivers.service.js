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

// const fetchDriverByUniqueId = async (uniqueid) => {
//     return prisma.tc_drivers.findUnique({ where: { uniqueid } })
// };

// const createMultipleDriversConcurrently = async (drivers) => {
//     try {
//         return prisma.tc_drivers.createMany({
//             data: drivers.map(driver => {
//                 return {
//                     name: driver.name,
//                     uniqueid: String(driver.id),
//                     attributes: JSON.stringify(driver)
//                 }
//             })
//         })
//     } catch (error) {
//         console.error('Error creating some drivers:', error.response?.data || error.message);
//         throw new CustomError(`Error creating some drivers in Traccar`, INTERNAL_SERVER_ERROR);
//     }
// };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const createMultipleDriversConcurrently = async (drivers, limit = 1000, delayTime = 500) => {
    const results = [];
    const errors = [];
  
    for (let i = 0; i < drivers.length; i += limit) {
      const batch = drivers.slice(i, i + limit);
      const batchPromises = batch.map(driver => {
        const payload = {
          name: driver.name,
          uniqueId: driver.uniqueid,
        };
  
        return traccarService.post('/drivers', payload)
          .then(response => results.push(response.data))  // Only store relevant data
          .catch(error => {
            const errorMessage = error.response 
              ? { code: driver.code, status: error.response.status, message: error.response.data }
              : { code: driver.code, message: error.message };
  
            console.error(`Error registering code with Traccar: ${errorMessage.message}`);
            errors.push(errorMessage);
          });
      });
  
      await Promise.all(batchPromises);
  
      if (i + limit < drivers.length) {
        await delay(delayTime);
      }
    }
  
    if (errors.length > 0) {
      throw new Error(`Some drivers failed to register: ${JSON.stringify(errors)}`);
    }
  
    return results;
  };
  

// const createMultipleDriversConcurrently = async (drivers, limit = 1000, delayTime = 500) => {
//   const results = [];
//   const errors = [];

//   // Process drivers in batches to manage rate limits
//   for (let i = 0; i < drivers.length; i += limit) {
//     const batch = drivers.slice(i, i + limit);
//     const batchPromises = batch.map(driver => {
//       const payload = {
//         name: driver.name,
//         uniqueId: driver.code,
//         // Add other fields if needed
//       };

//       return traccarService.post('/drivers', payload)
//         .then(response => results.push(response))
//         .catch(error => {
//           const errorMessage = error.response 
//             ? `Error registering code with Traccar: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
//             : `Error registering code with Traccar: ${error.message}`;
          
//           console.error(errorMessage);
//           errors.push(errorMessage);
//         });
//     });

//     // Wait for all promises in the batch to complete
//     await Promise.all(batchPromises);

//     // Delay between batches
//     if (i + limit < drivers.length) {
//       await delay(delayTime);
//     }
//   }

//   if (errors.length > 0) {
//     throw new Error(`Some drivers failed to register: ${errors.join(', ')}`);
//   }

//   return results;
// };
// Get driver ID by uniqueId
const getDriverIdByUniqueId = async (uniqueId) => {
    try {
      const response = await traccarService.get(`/drivers?uniqueId=${uniqueId}`);
      const drivers = response.data;
  
      // Check if drivers is an array and contains at least one driver
      if (Array.isArray(drivers) && drivers.length > 0) {
        // Find the driver with the matching uniqueId
        const driver = drivers.find(driver => driver.uniqueId === uniqueId);
  
        if (driver) {
          return driver.id; // Return the ID of the matched driver
        } else {
          throw new Error('Driver not found for uniqueId: ' + uniqueId);
        }
      } else {
        throw new Error('No drivers found.');
      }
    } catch (error) {
      const errorMessage = error.response 
        ? `Error fetching driver ID: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
        : `Error fetching driver ID: ${error.message}`;
    
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  
  // Delete driver by ID
  const deleteDriverById = async (driverId) => {
    try {
      const response = await traccarService.delete(`/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response 
        ? `Error deleting driver: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
        : `Error deleting driver: ${error.message}`;
    
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Deregister a driver with Traccar
  const deleteDriver = async (uniqueId) => {
    try {
      const driverId = await getDriverIdByUniqueId(uniqueId);
      await deleteDriverById(driverId);

    } catch (error) {
      const errorMessage = `Error deregistering uniqueId with Traccar: ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
// const deleteTraccarDriver = async (driverId) => {
//     try {
//         await traccarService.delete(`/drivers/${driverId}`);
//         // return prisma.tc_drivers.delete({ where: { id: driverId } })
//     } catch (error) {
//         console.error(`Error deleting driver with ID ${driverId}:`, error.response?.data || error.message);
//         throw new CustomError(`Failed to delete driver with ID ${driverId}`, INTERNAL_SERVER_ERROR);
//     }
// };


const updateDriver = async (driverId, updatedData) => {
    // const deviceId = await getDeviceIdByIMEI(imei);
  
    console.log("update driver from driver.service");
    const payload = {
      id:driverId,
      name: updatedData.name,       // Required field
      uniqueId: updatedData.uniqueid,   // Required field (usually imei is used as uniqueId)
      // Add other fields if needed, e.g., model, brand, etc.
      
    };
    console.log(driverId, payload);
    try {
   
      console.log(driverId, payload);
      // axios.put() // isssssssssssssssssue
      let config = {
        headers: {
          Accept: 'application/json',  // Setting the Accept header
        }
      }
     const response= await traccarService.put(`/drivers/${driverId}`, payload,config);
  
  console.log(response);
      return response.data;
    } catch (error) {
      console.error(`Error updating driver with ID ${driverId}:`, error.response?.data || error.message);
      throw new Error(`Failed to update driver with ID ${driverId}`);
    }
  };

// const updateTraccarDriverByUniqueId = async (driverId, updatedData) => {
//     try {
//         let data = { attributes: JSON.stringify(updatedData) }
//         if (updatedData.name) data.name = updatedData.name

//         // return prisma.tc_drivers.update({ where: { uniqueid: driverId }, data })
//     } catch (error) {
//         console.error(`Error updating driver with ID ${driverId}:`, error.response?.data || error.message);
//         throw new CustomError(`Failed to update driver with ID ${driverId}`, INTERNAL_SERVER_ERROR);
//     }
// };

module.exports = {
    createTraccarDriver,
    fetchAllDrivers,
    createMultipleDriversConcurrently,
    deleteDriver,
    updateDriver,
    getDriverIdByUniqueId
}