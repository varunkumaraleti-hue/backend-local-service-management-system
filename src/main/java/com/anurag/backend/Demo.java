package com.anurag.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Demo {

    @GetMapping("/")
    public String test() {
        return "Hello Worldsss";
    }

    @GetMapping("/test")
    public String test1() {
        return "Hello World";
    }

    @GetMapping("/venu")
    public String hi() {
        return "Welcome to Spring Boot!";
    }
}
