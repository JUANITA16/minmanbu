// Imports

// Averages y Mocks globales
jest.mock("../../utils/connectBack", () => ({
    connectBack: jest.fn().mockResolvedValue({
        data: "test",
        status: 200
    })
}))

beforeAll(() => {
});

beforeEach(() => {
});

afterAll(() => {
    jest.resetAllMocks();
});

afterEach(() => {
});

describe('simpleCtrl', () => {

    test('simple', async () => {
        // Average
        const result = {};
        const req = {
            path: "/test",
            method: "get",
            query: {},
            headers: {},
            body: {}
        }
        const res = {
            status: (code) => {
                result.status = code;
                return res;
            },
            json: (data) => (result.data = data)
        }

        const expected = {
            data: "test",
            status: 200
        }
        // Act
        const simpleCtrl = require('../../controllers/simpleController');
        await simpleCtrl(req, res)

        // Assert
        expect(result).toEqual(expected);
    });
});