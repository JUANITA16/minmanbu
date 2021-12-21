package com.btgpactual.minmambu.proxy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class MutableServletRequest extends HttpServletRequestWrapper {
    public MutableServletRequest(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String getMethod(){
        return "GET";
    }
}
