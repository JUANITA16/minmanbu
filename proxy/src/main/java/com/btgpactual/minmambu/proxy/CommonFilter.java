package com.btgpactual.minmambu.proxy;

import lombok.AllArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;

@Component
@Order(1)
@AllArgsConstructor
public class CommonFilter implements Filter {

    private final static String ATTR_RQ = "signed_request";
    private TokenValidation tokenValidation;

    @Override
    public void init(javax.servlet.FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRq = (HttpServletRequest) servletRequest;
        if("POST".equals(httpRq.getMethod())){
            if(httpRq.getParameter(ATTR_RQ) == null){
                throw new RuntimeException("atribute not found "+ATTR_RQ);
            }
            MutableServletRequest httpRqWrapper = new MutableServletRequest(httpRq);

            String token = httpRq.getParameter(ATTR_RQ);
            MambuSignedObject mambuSignedObject = tokenValidation.validate(token);
            httpRq.getRequestDispatcher("/"+httpRq.getRequestURI());

            filterChain.doFilter(httpRqWrapper,servletResponse);
        }else{
            filterChain.doFilter(servletRequest,servletResponse);
        }

    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
