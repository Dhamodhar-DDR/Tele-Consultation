package com.example.demo.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query(value = "SELECT * FROM Appointment WHERE doctor_id = :docId AND status = 'waiting' ORDER BY booking_time ASC LIMIT 1;",nativeQuery = true)
    Appointment get_earliest_appointment(@Param("docId") Integer docId);

    @Query(value = "SELECT COUNT(*) FROM Appointment WHERE status = 'waiting' AND booking_time < (SELECT booking_time FROM Appointment WHERE appointment_id = :appId) AND doctor_id = (SELECT doctor_id FROM Appointment WHERE appointment_id = :appId);",nativeQuery = true)
    Integer get_queue_count(@Param("appId") Integer appId);


    @Query(value = "SELECT d.online_status FROM Doctor d JOIN Appointment a ON d.doctor_id = a.doctor_id WHERE a.appointment_id = :appId ;",nativeQuery = true)
    Boolean check_doctor_status(@Param("appId") Integer appId);
    Appointment findByAppointmentId(Integer appId);
}

