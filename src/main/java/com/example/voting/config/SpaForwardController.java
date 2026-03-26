package com.example.voting.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {
    @RequestMapping(value = "/{path:^(?!api|swagger-ui|v3)[^.]+$}/**", method = {org.springframework.web.bind.annotation.RequestMethod.GET})
    public String forward() {
        return "forward:/index.html";
    }
}
