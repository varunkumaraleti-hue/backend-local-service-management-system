package com.localservices.backend.service;

import com.localservices.backend.entity.Service;
import com.localservices.backend.repository.ServiceRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    // CREATE
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    // READ ALL
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // READ ONE
    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    // UPDATE
    public Service updateService(Long id, Service serviceDetails) {

        Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        existingService.setServiceName(serviceDetails.getServiceName());
        existingService.setDescription(serviceDetails.getDescription());
        existingService.setPrice(serviceDetails.getPrice());
        existingService.setCategory(serviceDetails.getCategory());

        return serviceRepository.save(existingService);
    }

    // DELETE
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}