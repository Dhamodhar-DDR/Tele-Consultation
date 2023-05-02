package com.example.demo.appointment;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.List;

@Service
public class AppointmentService {
    private AppointmentRepository appointmentRepository;
    public AppointmentService(AppointmentRepository appointmentRepository){
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(Timestamp bookingTime, int patientId, String doctorId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String followupReason, String status, String description) {
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId, startTime, endTime, isFollowup, markForFollowup, followupReason, status, description);
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

    public String getStatus(int appId) {
        Appointment app =  appointmentRepository.findByAppointmentId(appId);
        return app.getStatus();
    }

    public boolean setStartTime(int id, Timestamp value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStartTime(value);
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }
    public boolean setEndTime(int id, Timestamp value) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setEndTime(value);
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }
    }

    public Appointment get_earliest_appointment(Integer docId){
        return appointmentRepository.get_earliest_appointment(docId);
    }

    public Integer get_queue_count(Integer appId){
        return appointmentRepository.get_queue_count(appId);
    }

    public Boolean get_doctor_status(Integer appId){
        return appointmentRepository.check_doctor_status(appId);
    }

    public Appointment get_appointment_by_id(Integer appId){
        return appointmentRepository.findByAppointmentId(appId);
    }

    public List<String> get_doctor_names(Integer patId){
        return appointmentRepository.get_doctor_names(patId);
    }

    public List<String> get_patient_names(Integer docId){
        return appointmentRepository.get_patient_names(docId);
    }

    public List<String> get_doctor_specs(Integer patId){
        return appointmentRepository.get_doctor_specs(patId);
    }

    public List<Appointment> get_patient_appointments(Integer patId){
        return appointmentRepository.get_patient_appointments(patId);
    }
    public List<Appointment> get_doctor_appointments(Integer docId){
        return appointmentRepository.get_doctor_appointments(docId);
    }

    public List<Appointment> get_doctor_followup_appointments(Integer docId){
        return appointmentRepository.get_doctor_followup_appointments(docId);
    }

    public Boolean set_appointment_for_followup(Integer appId, Boolean mark, String reason){
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appId);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setMarkForFollowup(mark);
            appointment.setFollowupReason(reason);
            appointmentRepository.save(appointment);
            return true;
        } else {
            return false;
        }

    }
}
