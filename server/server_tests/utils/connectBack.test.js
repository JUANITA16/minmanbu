import axios from 'axios';
import { connectBack } from '../../utils/connectBack';

jest.mock("axios");

// Averages y Mocks globales
beforeAll(() => {
});

beforeEach(() => {
});

afterEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
});

describe('connectBack', () => {

  test('connectBack - get petition', async () => {
        // Average
    const url = "test";
    const method = "get";
    const params = {};
    const headers = {};
    const body = {};

    jest.mock("../../utils/secret", () => ({
      getSecret: jest.fn().mockResolvedValueOnce("test_token")
    }));

    const resp = { 
      data: "test",
      status: 200
    };
    axios.request.mockResolvedValue(resp);

    const expected = {
      status:200, 
      data: "test"
    };

    // Act
    const result = await connectBack(url,method,params,headers,body);

    // Assert
    expect(result).toEqual(expected);
  });

  test('connectBack - get petition error', async () => {
        // Average
        const url = "test";
    const method = "error";
    const params = {};
    const headers = {};
    const body = {};

    jest.mock("../../utils/secret", () => ({
      getSecret: jest.fn().mockResolvedValueOnce("test_token")
    }));
    const resp = { 
      response: { data: "test", status: 400 },
    };
    axios.request.mockRejectedValue(resp);

    const expected = {
      status:400, 
      data: "test",
    };
    // Act
    const result = await connectBack(url,method,params,headers,body);

    // Assert
    expect(result).toEqual(expected);
  });

});