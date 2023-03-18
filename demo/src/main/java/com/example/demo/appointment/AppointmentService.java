package com.example.demo.appointment;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AppointmentService {
    private AppointmentRepository appointmentRepository;
    public AppointmentService(AppointmentRepository appointmentRepository){
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(Timestamp bookingTime, int patientId, String doctorId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String status, String description) {
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId, startTime, endTime, isFollowup, markForFollowup, status, description);
        return appointmentRepository.save(appointment);
    }

    public boolean setMarkForFollowup(int id, boolean value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setMarkForFollowup(value);
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }

    public boolean setStatus(int id, String value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(value);
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }

    public boolean setStartTime(int id, LocalDateTime value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStartTime(Timestamp.valueOf(value));
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }
    public boolean setEndTime(int id, LocalDateTime value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setEndTime(Timestamp.valueOf(value));
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }

}
