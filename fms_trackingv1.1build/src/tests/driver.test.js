const request = require('supertest');
const app = require('../../app'); // Import from app.js

describe('Driver', () => {

    // Test for registering a new driver
    it('should register a new driver', async () => {
        const response = await request(app)
            .post('/drivers/register')
            .send({
                "name": "John Doe",
                "code": "ssDR1230sddsd32s4566",
                "idNo": "A123456sd3e789",
                "phoneNumber": "+201121299368",
                "emergencyPhoneNumber": "+0987654321",
                "address": "123 Main St, Anytown, USA",
                "licenseNo": "LIC98798562654321",
                "licenseStartDate": "2023-01-01",
                "licenseExpireDate": "2025-01-01",
                "licenseExpireReminder": true,
                "contractStartDate": "2023-01-01",
                "contractExpireDate": "2024-01-01",
                "contractExpireReminder": true
            })
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id'); // Adjusted to match the actual response structure
        expect(response.body.name).toBe("John Doe");
    });

    // Test for listing all drivers
    it('should list all drivers', async () => {
        const response = await request(app).get('/drivers?page=1&limit=10');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array); // Adjusted to match the actual response structure
    });

    // Test for getting a driver by ID
    it('should get a driver by ID', async () => {
        const response = await request(app).get('/drivers/11039');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 11039); // Adjusted to match the actual response structure
        expect(response.body).toHaveProperty('name');
    });

    // Test for updating a driver by ID
    // it('should update a driver by ID', async () => {
    //     const response = await request(app)
    //         .put('/drivers/1')
    //         .send({
    //             name: "Jane Doe"
    //         });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.data).toHaveProperty('id', 1); // Adjusted to match the actual response structure
    //     expect(response.body.data.name).toBe("Jane Doe");
    // });

    // Test for deleting a driver by ID
    it('should delete a driver by ID', async () => {
        const response = await request(app).delete('/drivers/11039');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Driver deleted successfully');
    });

    // Test for bulk uploading drivers
    // it('should bulk upload drivers', async () => {
    //     const response = await request(app)
    //         .post('/drivers/bulk-upload')
    //         .send([
    //             {
    //                 name: "Driver 1",
    //                 licenseNumber: "987654321",
    //                 phoneNumber: "555-9876",
    //                 address: "456 Elm St"
    //             },
    //             {
    //                 name: "Driver 2",
    //                 licenseNumber: "123456780",
    //                 phoneNumber: "555-4321",
    //                 address: "789 Oak St"
    //             }
    //         ]);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.data).toHaveLength(2); // Adjusted to match the actual response structure
    // });

});
