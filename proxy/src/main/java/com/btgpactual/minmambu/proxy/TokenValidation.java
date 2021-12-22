package com.btgpactual.minmambu.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonInclude;

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
        log.info("Token valido: "+token)
        String header = tokenParts[0];
        String body = tokenParts[1];
        byte[] decodeBytes = Base64.getDecoder().decode(body);
        boolean hmacVerify = HmacVerifyUtil.verifySignature(appConfig.getKey(),header,body);
        if(!hmacVerify){
            throw new RuntimeException("Invalid request");
        }
        body = new String(decodeBytes);
        log.info("Token verificado con exito: "+body)
        ObjectMapper om = new ObjectMapper();
        om.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        try {
            return om.readValue(body,MambuSignedObject.class);
        } catch (JsonProcessingException e) {
            log.error("Error transformando JSON a MambuSignedObject",e);
            throw new RuntimeException("Invalid signed object");
        }
    }
}
