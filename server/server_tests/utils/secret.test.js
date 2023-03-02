// Imports

// Averages y Mocks globales
beforeAll(() => {
    process.env.REGION = "test";
    jest.mock("aws-sdk", () => {
        return {
            __esModule: true,
            SecretsManager: jest.fn().mockReturnValue({ 
                getSecretValue: jest.fn().mockReturnValue({ 
                    promise: jest.fn()
                        .mockResolvedValueOnce({ SecretString: "test" })
                        .mockResolvedValue({})
                }) 
            })
        }
    })
});

beforeEach(() => {
});

afterAll(() => {
    jest.resetAllMocks();
});

afterEach(() => {
});

describe('secret', () => {

    test('secret - if', async () => {
        // Average
        const secretId = "test"

        const expected = "test";
        // Act
        const { getSecret } = require('../../utils/secret');
        const result = await getSecret(secretId)

        // Assert
        expect(result).toEqual(expected);
    });

    test('secret - null', async () => {
        // Average
        const secretId = "test"

        const expected = null;
        // Act
        const { getSecret } = require('../../utils/secret');
        const result = await getSecret(secretId)

        // Assert
        expect(result).toEqual(expected);
    });
    
});