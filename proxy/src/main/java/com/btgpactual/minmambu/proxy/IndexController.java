package com.btgpactual.minmambu.proxy;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    @RequestMapping(value = {"/ui-**"})
    public String index(){
        return "forward:/";
    }

}
