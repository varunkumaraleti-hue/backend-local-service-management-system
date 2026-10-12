package com.localservices.backend.service;

import com.localservices.backend.entity.Booking;
import com.localservices.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Create a booking request
    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // Get all booking requests
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Admin accepts or declines a booking
    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!status.equals("ACCEPTED") &&
            !status.equals("DECLINED")) {
            throw new IllegalArgumentException(
                    "Status must be ACCEPTED or DECLINED");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}