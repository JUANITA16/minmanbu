package com.btgpactual.minmambu.proxy;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MambuSignedObject {
    @JsonProperty("USER_KEY")
    private String userKey;
    @JsonProperty("ALGORITHM")
    private String algorithm;
    @JsonProperty("TENANT_ID")
    private String tenantId;
    @JsonProperty("DOMAIN")
    private String domain;
}
