// Imports
import request from 'supertest';
import setUp from '../app';

// Averages y Mocks globales
beforeAll(() => {
    process.env.CLIENT_BASE_PATH = "/test";
    process.env.SERVER_BASE_PATH = "/test/api";
    process.env.REACT_APP_TENANTID = "test";
    process.env.REACT_APP_CLIENTID = "test";
    process.env.REACT_APP_REDIRECT_URI = "http://localhost:3000";
});

describe('app', () => {

    test('app - Health Check', async () => {
        // Average
        const expected = { api: "Minmambu front", message: "Health OK!" }
        // Act
        const app = await setUp();
        const result = await request(app).get('/test/api/healthCheck');
        // Assert
        expect(JSON.parse(result.text)).toEqual(expected);
    })

    test('app - Not Found', async () => {
        // Average
        const expected = "Sorry cant find that";
        // Act
        const app = await setUp();
        const result = await request(app).get('/notfount');
        // Assert
        expect(result.text).toEqual(expected);
    })

});