package com.btgpactual.minmambu.proxy;

import org.junit.Test;

import static org.junit.Assert.*;

public class HmacVerifyUtilTest {

    @Test
    public void verifySignature() {
        String key ="mambu";
        String hash = "25ef9903e1b37c775431f4f9fbb45bf99ef7f2a04c1c60749062e85b6c9bb929";
        boolean valor  = HmacVerifyUtil.verifySignature(key,hash,"{\n" +
                "    \"USER_KEY\":\"402832b43809601c013809601f9d0002\",\n" +
                "    \"ALGORITHM\":\"hmacSHA256\",\n" +
                "    \"TENANT_ID\":\"demo_tenant\"\n" +
                "}");
        assertTrue(valor);
    }

    @Test
    public void verifySignatureError() {
        String key ="mambu123123";
        String hash = "25ef9903e1b37c775431f4f9fbb45bf99ef7f2a04c1c60749062e85b6c9bb929";
        boolean valor  = HmacVerifyUtil.verifySignature(key,hash,"{\n" +
                "    \"USER_KEY\":\"402832b43809601c013809601f9d0002\",\n" +
                "    \"ALGORITHM\":\"hmacSHA256\",\n" +
                "    \"TENANT_ID\":\"demo_tenant\"\n" +
                "}");
        assertFalse(valor);
    }

    @Test
    public void verifySignatureErrorHash() {
        String key ="mambu123123";
        String hash = "25ef9903e1b37c775431f4f9fbb45bf99ef7f2a04c1c60749062e85b6c9bb92911";
        boolean valor  = HmacVerifyUtil.verifySignature(key,hash,"{\n" +
                "    \"USER_KEY\":\"402832b43809601c013809601f9d0002\",\n" +
                "    \"ALGORITHM\":\"hmacSHA256\",\n" +
                "    \"TENANT_ID\":\"demo_tenant\"\n" +
                "}");
        assertFalse(valor);
    }
}