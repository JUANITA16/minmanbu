package com.btgpactual.minmambu.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Slf4j
@Component
@AllArgsConstructor
public class TokenValidation {

    private AppConfig appConfig;

    public MambuSignedObject validate(String token){
        String [] tokenParts = token.split("\\.");
        if(tokenParts == null || tokenParts.length != 2){
            throw new RuntimeException("Invalid token");
        }
        log.info("oktne "+token);
        log.info("key "+appConfig.getKey());
        String header = tokenParts[0];
        String body = tokenParts[1];
        byte[] decodeBytes = Base64.getDecoder().decode(body);
        boolean hmacVerify = HmacVerifyUtil.verifySignature(appConfig.getKey(),header,body);
        if(!hmacVerify){
            throw new RuntimeException("Invalid request");
        }
        body = new String(decodeBytes);
        ObjectMapper om = new ObjectMapper();
        try {
            return om.readValue(body,MambuSignedObject.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Invalid signed object");
        }
    }
}
