// tests/vehicles.test.js

const request = require('supertest');
const app = require('../../app'); // Import from app.js
const prisma = require('../prisma/prisma'); // Prisma client
// const { convertVehicleDataTypes } = require('../../utils/conversion');
const path = require('path');
const fs = require('fs');

const generateIMEI = () => {
    return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
  };

describe('Vehicle API Endpoints', () => {
  beforeAll(async () => {
    // Set up any required data, mock services, etc.
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up
    await prisma.$disconnect();
  });

  describe('POST /vehicles/register', () => {
    const imei = generateIMEI();
    
    it('should create a new vehicle', async () => {
      const driver = await prisma.driver.findFirst(); // Fetch a vehicle for the test
    if(!driver) throw new Error("please add driver first")
      const response = await request(app)
        .post('/vehicles/register')
        .field('name', 'Test Vehicle')
        .field('code', 'TV123')
        .field('imei', imei)
        .field('make', 'Toyota')
        .field('model', 'Corolla')
        .field('registrationNumber', 'ABC-1234')
        .field('fuelType', 'Petrol')
        .field('fuelConsumption', 6.5)
        .field('fuelCost', 3.2)
        .field('vehicleType', 'Delivery Trucks')
        .field('plateNumber', 'XYZ-987')
        .field('vin', '1HGCM82633A123456')
        .field('licenseExpire', '2025-12-31T00:00:00Z')
        .field('licenseExpireReminder', true)
        .field('simNumber', '+1234567890')
        .field('simNumberSerial', 'SIM1234567890')
        .field('odometer', 12000)
        .field('brand', 'Toyota')
        .field('color', 'Red')
        .field('year', 2020)
        .field('vehicleExpires', '2024-12-31T00:00:00Z')
        .field('parent', 1)
        .field('accSupport', true)
        .field('fuelSupport', false)
        .field('fuelCapacity', 50.0)
        .field('tankHeight', 1.2)
        .field('tankWidth', 1.5)
        .field('tankLength', 2.0)
        .field('doorSupport', true)
        .field('weightSensorSupport', false)
        .field('temperatureSensorSupport', false)
        .field('iButtonSensorSupport', false)
        .field('ptoSensorSupport', false)
        .field('seatSensorSupport', false)
        .field('refrigeratorSensorSupport', false)
        .field('headlightsSensorSupport', true)
        .field('idleTime', 10)
        .field('idleAlert', true)
        .field('archived', false)
        .field('department', 5)
        .field('driverId', driver.id)
        .field('icon', 'car.png')
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  
    it('should return 409 for duplicate IMEI', async () => {
      const response = await request(app)
        .post('/vehicles/register')
        .send({
            "name": "Test Vehicle",
            "code": "TV123",
            "imei": imei,
            "make": "Toyota",
            "model": "Corolla",
            "registrationNumber": "ABC-1234",
            "fuelType": "Petrol",
            "fuelConsumption": 6.5,
            "fuelCost": 3.2,
            "vehicleType": "Delivery Trucks",
            "plateNumber": "XYZ-987",
            "vin": "1HGCM82633A123456",
            "licenseExpire": "2025-12-31T00:00:00Z",
            "licenseExpireReminder": true,
            "simNumber": "+1234567890",
            "simNumberSerial": "SIM1234567890",
            "odometer": 12000,
            "brand": "Toyota",
            "color": "Red",
            "year": 2020,
            "vehicleExpires": "2024-12-31T00:00:00Z",
            "parent": 1,
            "accSupport": true,
            "fuelSupport": false,
            "fuelCapacity": 50.0,
            "tankHeight": 1.2,
            "tankWidth": 1.5,
            "tankLength": 2.0,
            "doorSupport": true,
            "weightSensorSupport": false,
            "temperatureSensorSupport": false,
            "iButtonSensorSupport": false,
            "ptoSensorSupport": false,
            "seatSensorSupport": false,
            "refrigeratorSensorSupport": false,
            "headlightsSensorSupport": true,
            "idleTime": 10,
            "idleAlert": true,
            "archived": false,
            "department": 5,
            "driverId": 1,
            "icon": "car.png"
          }
          );
  
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/Dublicated IMEI/);
    });
  });
  

  describe('GET /', () => {
    it('should return a list of vehicles with pagination', async () => {
      const response = await request(app)
        .get('/vehicles')
        .query({ page: 1, limit: 10 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('vehicles'); // Ensure the response has a "vehicles" property
        expect(response.body.vehicles).toBeInstanceOf(Array);
    });

    it('should return vehicles sorted by name', async () => {
      const response = await request(app)
        .get('/vehicles')
        .query({  page: 1, limit: 10,sortBy: 'name', sortOrder: 'asc' });

      expect(response.status).toBe(200);
      // Further assertions can be added to check the sort order
    });
  });

  describe('GET /:id', () => {
    it('should return a specific vehicle', async () => {
      const vehicle = await prisma.vehicle.findFirst(); // Fetch a vehicle for the test
      const response = await request(app)
        .get(`/vehicles/${vehicle.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', vehicle.id);
    });

    it('should return 404 for a non-existent vehicle', async () => {
      const response = await request(app)
        .get('/vehicles/9999'); // Assuming 9999 does not exist

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Vehicle not found/);
    });
  });

  describe('PUT /:id', () => {
    it('should update a vehicle', async () => {
      const vehicle = await prisma.vehicle.findFirst();
      const response = await request(app)
        .put(`/vehicles/${vehicle.id}`)
        .send({
          name: 'Updated Vehicle Name',
          imei: '123456789012346' // New IMEI
        });

      expect(response.status).toBe(200);
    //   expect(response.body.name).toBe('Updated Vehicle Name');
    });

    it('should return 409 for IMEI conflict', async () => {
      const vehicle = await prisma.vehicle.findFirst({skip: 1});
      
      const response = await request(app)
        .put(`/vehicles/${vehicle.id}`)
        .send({
          imei: "123456789012346" // This IMEI is already taken
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/The provided IMEI is already in use/);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a vehicle', async () => {
      const vehicle = await prisma.vehicle.findFirst({skip:1});
      console.log({vehicle});

      const response = await request(app)
        .delete(`/vehicles/${vehicle.id}`);      
      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const response = await request(app)
        .delete('/vehicles/9999'); // Assuming 9999 does not exist

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Vehicle not found/);
    });
  });
});
