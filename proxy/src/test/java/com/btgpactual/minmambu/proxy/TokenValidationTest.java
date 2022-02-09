package com.btgpactual.minmambu.proxy;

import org.junit.Test;

import static org.junit.Assert.*;

public class TokenValidationTest {

    @Test
    public void validate() {
        String token = "f171087bd7156cc2246e19fc1e107e6b761e1fc3640e1b7338a3a87be4d9033e." +
                "eyJVU0VSX0tFWSI6IjQwMjgzMmI0MzgwOTYwMWMwMTM4MDk2MDFmOWQwMDAyIiwiQUxHT1JJVEhNIjoiaG1hY1NIQTI1NiIsIlRFTkFOVF9JRCI6ImRlbW9fdGVuYW50In0";

        MambuSignedObject signedObjectExpected = new MambuSignedObject();
        signedObjectExpected.setAlgorithm("hmacSHA256");
        signedObjectExpected.setTenantId("demo_tenant");
        signedObjectExpected.setUserKey("402832b43809601c013809601f9d0002");

        AppConfig app = new AppConfig();
        app.setKey("mambu");
        TokenValidation tokenValidation = new TokenValidation(app);
        MambuSignedObject signedObject = tokenValidation.validate(token);
        assertEquals(signedObject,signedObjectExpected);
    }

    @Test
    public void invalidToken () {
        String token = "invalidtoken";
        AppConfig app = new AppConfig();
        app.setKey("mambu");
        TokenValidation tokenValidation = new TokenValidation(app);
        assertThrows("Invalid token",RuntimeException.class, ()->tokenValidation.validate(token));
    }

    @Test
    public void nullToken () {
        String token = null;
        AppConfig app = new AppConfig();
        app.setKey("mambu");
        TokenValidation tokenValidation = new TokenValidation(app);
        assertThrows("Invalid token",RuntimeException.class, ()->tokenValidation.validate(token));
    }

    @Test
    public void tokenHeaderInvalid() {
        String token = "invalid." +
                "eyJVU0VSX0tFWSI6IjQwMjgzMmI0MzgwOTYwMWMwMTM4MDk2MDFmOWQwMDAyIiwiQUxHT1JJVEhNIjoiaG1hY1NIQTI1NiIsIlRFTkFOVF9JRCI6ImRlbW9fdGVuYW50In0";
        AppConfig app = new AppConfig();
        app.setKey("mambu");
        TokenValidation tokenValidation = new TokenValidation(app);
        assertThrows("Invalid request",RuntimeException.class, ()->tokenValidation.validate(token));
    }

    @Test
    public void tokenBodyInvalid() {
        String token = "f171087bd7156cc2246e19fc1e107e6b761e1fc3640e1b7338a3a87be4d9033e." +
                "ew0KICAgICJDQU1CSU8iOiI0MDI4MzJiNDM4MDk2MDFjMDEzODA5NjAxZjlkMDAwMiIsDQogICAgIkFMR09SSVRITSI6ImhtYWNTSEEyNTYiLA0KICAgICJURU5BTlRfSUQiOiJkZW1vX3RlbmFudCINCn0";
        AppConfig app = new AppConfig();
        app.setKey("mambu");
        TokenValidation tokenValidation = new TokenValidation(app);
        assertThrows("Invalid signed object",RuntimeException.class, ()->tokenValidation.validate(token));
    }
}