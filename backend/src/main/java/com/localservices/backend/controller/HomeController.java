package com.localservices.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("application", "Local Services Management System");
        response.put("status", "Running");
        response.put("message", "Welcome! Your backend is working.");
        response.put("servicesAPI", "/api/services");
        response.put("bookingsAPI", "/api/bookings");

        return response;
    }
}