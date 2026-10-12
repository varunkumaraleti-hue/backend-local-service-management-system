package com.localservices.backend.controller;

import com.localservices.backend.entity.Service;
import com.localservices.backend.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://local-services-frontend-tvel.onrender.com"
})
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // CREATE
    @PostMapping
    public Service createService(@RequestBody Service service) {
        return serviceService.createService(service);
    }

    // READ ALL
    @GetMapping
    public List<Service> getAllServices() {
        return serviceService.getAllServices();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {

        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @RequestBody Service serviceDetails) {

        try {
            Service updatedService =
                    serviceService.updateService(id, serviceDetails);

            return ResponseEntity.ok(updatedService);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {

        try {
            serviceService.deleteService(id);
            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}