// Imports
const routeGuard = require('../../middleware/validateAuth');

// Averages y Mocks globales
beforeAll(() => {
});

beforeEach(() => {
});

afterAll(() => {
});

afterEach(() => {
});

describe('validateAuthMiddle', () => {

    test('validateAuth - Not roles', async () => {
        // Average
        const accessMatrix = {}
        const result = {};
        const req = {
            authInfo: {
                roles: undefined
            }
        }
        const res = {
            status: (code) => {
                result.statusCode = code;
                return res;
            },
            json: (data) => (result.data = data)
        }
        const next = () => (true);

        const expected = {
            statusCode: 403,
            data: {
                error: 'User without roles'
            }
        }

        // Act
        routeGuard(accessMatrix)(req, res, next)

        // Assert
        expect(result).toEqual(expected);
    });

    test('validateAuth - User not allowed', async () => {
        // Average
        const result = {};
        const accessMatrix = {
            test: {
                path: "/test",
                methods: [ "GET" ],
                roles: [ "TEST_ADMIN" ]
            }
        }
        const req = {
            path: "/test",
            method: "GET",
            authInfo: {
                roles: ["TEST"]
            }
        }
        const res = {
            status: (code) => {
                result.statusCode = code;
                return res;
            },
            json: (data) => (result.data = data)
        }
        const next = () => (true);

        const expected = {
            statusCode: 403,
            data: {
                error: 'User not allowed'
            }
        }

        // Act
        routeGuard(accessMatrix)(req, res, next)

        // Assert
        expect(result).toEqual(expected);
    });
    
    test('validateAuth - Action not allowed', async () => {
        // Average
        const result = {};
        const accessMatrix = {
            test: {
                path: "/test",
                methods: [ "GET" ],
                roles: [ "TEST_ADMIN" ]
            }
        }
        const req = {
            path: "/test",
            method: "POST",
            authInfo: {
                roles: ["TEST"]
            }
        }
        const res = {
            status: (code) => {
                result.statusCode = code;
                return res;
            },
            json: (data) => (result.data = data)
        }
        const next = () => (true);

        const expected = {
            statusCode: 403,
            data: {
                error: 'Action not allowed'
            }
        }

        // Act
        routeGuard(accessMatrix)(req, res, next)

        // Assert
        expect(result).toEqual(expected);
    });

    test('validateAuth - Unrecognized path', async () => {
        // Average
        const result = {};
        const accessMatrix = {
            test: {
                path: "/error",
                methods: [ "GET" ],
                roles: [ "TEST_ADMIN" ]
            }
        }
        const req = {
            path: "/test",
            method: "POST",
            authInfo: {
                roles: ["TEST"]
            }
        }
        const res = {
            status: (code) => {
                result.statusCode = code;
                return res;
            },
            json: (data) => (result.data = data)
        }
        const next = () => (true);

        const expected = {
            statusCode: 403,
            data: {
                error: 'Unrecognized path'
            }
        }

        // Act
        routeGuard(accessMatrix)(req, res, next)

        // Assert
        expect(result).toEqual(expected);
    });

    test('validateAuth - next', async () => {
        // Average
        const result = {};
        const accessMatrix = {
            test: {
                path: "/test",
                methods: [ "GET" ],
                roles: [ "TEST" ]
            }
        }
        const req = {
            path: "/test",
            method: "GET",
            authInfo: {
                roles: ["TEST"]
            }
        }
        const res = {}
        const next = () => (result.next = true);

        const expected = {
            next: true
        }

        // Act
        routeGuard(accessMatrix)(req, res, next)

        // Assert
        expect(result).toEqual(expected);
    });

});