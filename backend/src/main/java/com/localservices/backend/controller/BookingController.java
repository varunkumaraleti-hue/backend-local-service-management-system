package com.localservices.backend.controller;

import com.localservices.backend.entity.Booking;
import com.localservices.backend.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://local-services-frontend-tvel.onrender.com"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // USER: Submit a booking request
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        Booking savedBooking =
                bookingService.createBooking(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // ADMIN: View all booking requests
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings());
    }

    // ADMIN: Accept or decline a booking
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        Booking updatedBooking =
                bookingService.updateBookingStatus(id, status);

        return ResponseEntity.ok(updatedBooking);
    }
}
