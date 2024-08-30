// const traccarClient = require('./auth.service');

const axios = require('axios');
const traccarConfig = require('./auth.service');

const traccarService = axios.create({
  baseURL: traccarConfig.baseURL,
  auth: {
    username: traccarConfig.username,
    password: traccarConfig.password,
  },
});

const createDevice = async (conversinVehicleData) => {
  try {
    console.log(conversinVehicleData.imei)
    // Prepare the payload based on Traccar's required fields
    const payload = {
      name: conversinVehicleData.name,       // Required field
      uniqueId: conversinVehicleData.imei,   // Required field (usually imei is used as uniqueId)
      // Add other fields if needed, e.g., model, brand, etc.
    };

    await traccarService.post('/devices', payload);
  } catch (error) {
    // Improved error handling
    const errorMessage = error.response 
      ? `Error registering IMEI with Traccar: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
      : `Error registering IMEI with Traccar: ${error.message}`;
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};


// const createTraccarDevice = async (name, uniqueId) => {
//   try {
//     const response = await traccarService.createDevice('/devices', {
//       name: "erer",
//       uniqueId: 32323
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating device in Traccar:', error.response?.data || error.message);
//     throw new Error('Failed to create device in Traccar');
//   }
// };

// const createMultipleDevicesConcurrently = async (devices) => {
//   const promises = devices.map(device => createTraccarDevice(device.name, device.imei));
//   try {
//     const results = await Promise.all(promises);
//     return results;
//   } catch (error) {
//     console.error('Error creating some devices:', error.response?.data || error.message);
//     throw error;
//   }
// };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const createMultipleDevicesConcurrently = async (devices, limit = 1000, delayTime = 500) => {
  const results = [];
  const errors = [];

  // Process devices in batches to manage rate limits
  for (let i = 0; i < devices.length; i += limit) {
    const batch = devices.slice(i, i + limit);
    const batchPromises = batch.map(device => {
      const payload = {
        name: device.name,
        uniqueId: device.uniqueid,
        // Add other fields if needed
      };

      return traccarService.post('/devices', payload)
        .then(response => results.push(response))
        .catch(error => {
          const errorMessage = error.response 
            ? `Error registering IMEI with Traccar: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
            : `Error registering IMEI with Traccar: ${error.message}`;
          
          console.error(errorMessage);
          errors.push(errorMessage);
        });
    });

    // Wait for all promises in the batch to complete
    await Promise.all(batchPromises);

    // Delay between batches
    if (i + limit < devices.length) {
      await delay(delayTime);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Some devices failed to register: ${errors.join(', ')}`);
  }

  return results;
};


// const createMultipleDevicesConcurrently = async (devices) => {
//   const promises = devices.map(device => {
//     // Prepare the payload based on Traccar's required fields
//     const payload = {
//       name: device.name,       // Required field
//       uniqueId: device.uniqueid,   // Required field (usually imei is used as uniqueId)
//       // Add other fields if needed, e.g., model, brand, etc.
//     };
//     // Call the API and handle errors
//     return traccarService.post('/devices', payload)
//       .catch(error => {
//         // Improved error handling
//         const errorMessage = error.response 
//           ? `Error registering IMEI with Traccar: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
//           : `Error registering IMEI with Traccar: ${error.message}`;
        
//         console.error(errorMessage);
//         throw new Error(errorMessage);
//       });
//   });

//   try {
//     const results = await Promise.all(promises);
//     return results;
//   } catch (error) {
//     console.error('Error creating some devices:', error.message);
//     throw error;
//   }
// };

//functions for delete device from traccar by getting the device id first through imei and delete it from traccar

const getDeviceIdByIMEI = async (imei) => {
  try {
    const response = await traccarService.get(`/devices?uniqueId=${imei}`);
    const devices = response.data;
    if (devices.length > 0) {
      return devices[0].id; // Return the first device ID found
    } else {
      throw new Error('Device not found for IMEI: ' + imei);
    }
  } catch (error) {
    const errorMessage = error.response 
      ? `Error fetching device ID: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
      : `Error fetching device ID: ${error.message}`;
  
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Delete device by ID
const deleteDeviceById = async (deviceId) => {
  try {
    
    const response = await traccarService.delete(`/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response 
      ? `Error deleting device: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
      : `Error deleting device: ${error.message}`;
  1
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
// Deregister a device with Traccar
const deregisterIMEI = async (imei) => {
  try {
    const deviceId = await getDeviceIdByIMEI(imei);
    await deleteDeviceById(deviceId);
  } catch (error) {
    const errorMessage = `Error deregistering IMEI with Traccar: ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to fetch all devices from Traccar
// const fetchAllDevices = async () => {
//   try {
//     const response = await traccarClient.get('/devices');
//     return response.data; // This should be an array of devices
//   } catch (error) {
//     console.error('Error fetching devices from Traccar:', error.response?.data || error.message);
//     throw new Error('Failed to fetch devices from Traccar');
//   }
// };

// Function to delete a single device by ID
// const deleteDeviceById = async (deviceId) => {
//   try {
//     await traccarClient.delete(`/devices/${deviceId}`);
//     console.log(`Deleted device with ID: ${deviceId}`);
//   } catch (error) {
//     console.error(`Error deleting device with ID ${deviceId}:`, error.response?.data || error.message);
//     throw new Error(`Failed to delete device with ID ${deviceId}`);
//   }
// };

// Function to delete all devices
// const deleteAllDevices = async () => {
//   try {
//     // Step 1: Fetch all devices
//     const devices = await fetchAllDevices();

//     // Step 2: Delete each device
//     const deletePromises = devices.map(device => deleteDeviceById(device.id));
//     await Promise.allSettled(deletePromises);

//   } catch (error) {
//     console.error('Error deleting all devices:', error.message);
//   }
// };

// //  deleteAllDevices()
// const fetchDeviceByUniqueId = async (uniqueId) => {
//   const response = await traccarClient.get('/devices', {
//     params: {
//       uniqueId: uniqueId
//     }
//   });
//   // Filter the devices to find the one with the matching uniqueId
//   const device = response.data.find(device => device.uniqueId === uniqueId);
//   return device;
// };

const updateDevice = async (deviceId, updatedData) => {
  // const deviceId = await getDeviceIdByIMEI(imei);

  console.log("update device from vehicle.service");
  const payload = {
    id:deviceId,
    name: updatedData.name,       // Required field
    uniqueId: updatedData.uniqueid,   // Required field (usually imei is used as uniqueId)
    // Add other fields if needed, e.g., model, brand, etc.
    
  };
  console.log(deviceId, payload);
  try {
 
    console.log(deviceId, payload);
    // axios.put() // isssssssssssssssssue
    let config = {
      headers: {
        Accept: 'application/json',  // Setting the Accept header
      }
    }
   const response= await traccarService.put(`/devices/${deviceId}`, payload,config);

console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Error updating device with ID ${deviceId}:`, error.response?.data || error.message);
    throw new Error(`Failed to update device with ID ${deviceId}`);
  }
};

// // deleteAllDevices()

module.exports = {
  // createTraccarDevice,
  createMultipleDevicesConcurrently,
  // deleteDeviceById,
  // fetchDeviceByUniqueId,
  deregisterIMEI,
  getDeviceIdByIMEI,
  updateDevice,
  createDevice
};

// const prisma = require('../../prisma/prisma');


// const tcDevicesService = {
//   // Create a new device
//   createDevice: async (data) => {
//     return await prisma.tc_devices.create({
//       data,
//     });
//   },

//   // Update an existing device by ID
//   updateDevice: async (id, data) => {
//     return await prisma.tc_devices.update({
//       where: { id: parseInt(id) },
//       data,
//     });
//   },

//   // Delete a device by ID
//   deleteDevice: async (id) => {
//     return await prisma.tc_devices.delete({
//       where: { id: parseInt(id) },
//     });
//   },

//   // Find a device by ID
//   findDeviceById: async (id) => {
//     return await prisma.tc_devices.findUnique({
//       where: { id: parseInt(id) },
//     });
//   },

//   // Find a device by imei
//   findDeviceByImei: async (uniqueid) => {
//     return await prisma.tc_devices.findFirst({
//       where: { uniqueid },
//     });
//   },

//   // Find all devices with optional filters
//   findAllDevices: async (filters = {}) => {
//     return await prisma.tc_devices.findMany({
//       where: filters,
//     });
//   },

//   // Create many devices at once
//   createManyDevices: async (data) => {
//     return await prisma.tc_devices.createMany({
//       data,
//     });
//   },
// };

// module.exports = tcDevicesService;

