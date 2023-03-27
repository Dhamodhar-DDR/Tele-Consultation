package com.example.demo.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query(value = "SELECT * FROM Appointment WHERE doctor_id = :docId AND status = 'waiting' ORDER BY booking_time ASC LIMIT 1;",nativeQuery = true)
    Appointment get_earliest_appointment(@Param("docId") Integer docId);
    Appointment findByAppointmentId(Integer appId);
}

