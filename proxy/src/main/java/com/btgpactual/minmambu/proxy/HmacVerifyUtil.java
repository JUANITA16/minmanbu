package com.btgpactual.minmambu.proxy;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;

@Slf4j
public class HmacVerifyUtil {
    public static boolean verifySignature(String secretKey, String hmac, String queryString) {
        String reducedQueryString = queryString.replaceAll("hmac="+hmac+"&?", "");
        if(reducedQueryString.endsWith("&") && reducedQueryString.length() > 1) {
            reducedQueryString=reducedQueryString.substring(0, reducedQueryString.length()-1);
        }
        return verifyHmac(reducedQueryString, hmac, secretKey);
    }

    private static boolean verifyHmac(String message, String hmac, String secretKey) {
        try {
            Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            hmacSHA256.init(key);
            String fx = "%" + hmacSHA256.getMacLength()*2 + "x";
            String calculated = String.format(fx, new BigInteger(1, hmacSHA256.doFinal(message.getBytes())));
            return hmac.equals(calculated);
        } catch (Exception ex) {
            log.error("Error verifying hmac", ex);
            throw new IllegalArgumentException(ex);
        }
    }
}
