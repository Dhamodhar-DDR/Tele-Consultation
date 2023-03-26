package com.example.demo.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query(value = "SELECT * FROM Appointment WHERE booking_time > :bookingTime AND status = 'false' ORDER BY booking_time ASC LIMIT 1;",nativeQuery = true)
    Appointment get_earliest_appointment(@Param("bookingTime") Timestamp bookingTime);
    Appointment findByAppointmentId(Integer appId);
}

