package com.example.demo.appointment;

import com.twilio.rest.microvisor.v1.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query(value = "SELECT * FROM Appointment WHERE doctor_id = :docId AND status = 'waiting' ORDER BY booking_time ASC LIMIT 1;",nativeQuery = true)
    Appointment get_earliest_appointment(@Param("docId") Integer docId);

    @Query(value = "SELECT COUNT(*) FROM Appointment WHERE status = 'waiting' AND booking_time < (SELECT booking_time FROM Appointment WHERE appointment_id = :appId) AND doctor_id = (SELECT doctor_id FROM Appointment WHERE appointment_id = :appId);",nativeQuery = true)
    Integer get_queue_count(@Param("appId") Integer appId);

    @Query(value = "SELECT d.online_status FROM Doctor d JOIN Appointment a ON d.doctor_id = a.doctor_id WHERE a.appointment_id = :appId ;",nativeQuery = true)
    Boolean check_doctor_status(@Param("appId") Integer appId);

    @Query(value = "SELECT * FROM Appointment where patient_id = :patId ORDER BY booking_time ASC",nativeQuery = true)
    List<Appointment> get_patient_appointments(@Param("patId") Integer patId);

    @Query(value = "SELECT  cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name from doctor JOIN Appointment ON Appointment.doctor_id = Doctor.doctor_id WHERE Appointment.patient_id = :patId ORDER BY Appointment.booking_time ASC;",nativeQuery = true)
    List<String> get_doctor_names(@Param("patId") Integer patId);
    @Query(value = "SELECT Doctor.specialization FROM Doctor JOIN Appointment ON Appointment.doctor_id = Doctor.doctor_id WHERE Appointment.patient_id = :patId ORDER BY Appointment.booking_time ASC;",nativeQuery = true)
    List<String> get_doctor_specs(@Param("patId") Integer patId);

    @Query(value = "SELECT cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name FROM Patient JOIN Appointment ON Appointment.patient_id = Patient.patient_id WHERE Appointment.doctor_id = :docId ORDER BY Appointment.booking_time ASC;",nativeQuery = true)
    List<String> get_patient_names(@Param("docId") Integer docId);
    @Query(value = "SELECT cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name FROM Patient JOIN Appointment ON Appointment.patient_id = Patient.patient_id WHERE Appointment.doctor_id = :docId AND mark_for_followup = true ORDER BY booking_time ASC",nativeQuery = true)
    List<String>  get_followup_patient_names (@Param("docId") Integer docId);
    @Query(value = "SELECT * FROM Appointment where doctor_id = :docId ORDER BY booking_time ASC",nativeQuery = true)
    List<Appointment> get_doctor_appointments(@Param("docId") Integer docId);

    @Query(value = "SELECT * FROM Appointment where doctor_id = :docId AND mark_for_followup = true ORDER BY booking_time ASC",nativeQuery = true)
    List<Appointment> get_doctor_followup_appointments(@Param("docId") Integer docId);
    Appointment findByAppointmentId(Integer appId);
    @Query(value = "SELECT a.doctor_id FROM Appointment a JOIN Doctor d ON a.doctor_id = d.doctor_id WHERE a.patient_id = :patId AND a.status = 'completed' AND d.online_status = 1 ORDER BY a.booking_time DESC LIMIT 1;",nativeQuery = true)
    Integer find_prev_app_doc_id(@Param("patId") int patientId);
    @Query(value = "SELECT d.doctor_id, d.name, COUNT(a.appointment_id) AS waiting_appointments FROM Doctor d LEFT JOIN Appointment a ON d.doctor_id = a.doctor_id AND a.status = 'waiting' WHERE d.online_status = 1 AND d.specialization = :spec GROUP BY d.doctor_id ORDER BY waiting_appointments ASC LIMIT 1", nativeQuery = true)
    Integer get_least_waiting_docId(@Param("spec") String specialization);
    @Query(value = "SELECT d.specialization FROM Doctor d JOIN Appointment a ON d.doctor_id = a.doctor_id WHERE a.appointment_id = :appId", nativeQuery = true)
    String get_doc_spec_from_app(@Param("appId") int appId);

    @Query(value = "SELECT * from Appointment WHERE patient_id = :patId ORDER BY appointment_id DESC LIMIT 2", nativeQuery = true)
    List<Appointment> get_prev_app_diag(@Param("patId") int patientId);
}

