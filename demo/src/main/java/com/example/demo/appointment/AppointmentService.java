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
    public Appointment createAppointment_N(Timestamp bookingTime, int patientId, int doctorId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String followupReason, String status, String description) {
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId, startTime, endTime, isFollowup, markForFollowup, followupReason, status, description);
        return appointmentRepository.save(appointment);
    }
    private Integer find_prev_app_doc_id(int patientId) {
        Integer docId = appointmentRepository.find_prev_app_doc_id(patientId);
        if(docId == null) return -1;
        else return docId;
    }
    public Appointment createAppointment_FP(Timestamp bookingTime, int patientId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String followupReason, String status, String description) {
        int doctorId = find_prev_app_doc_id(patientId);
        if(doctorId==-1) return null;
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId, startTime, endTime, isFollowup, markForFollowup, followupReason, status, description);
        return appointmentRepository.save(appointment);
    }

    private Integer get_least_waiting_docId(String specialization) {
        Integer docId = appointmentRepository.get_least_waiting_docId(specialization);
        if(docId == null) return -1;
        else return docId;
    }
    public Appointment createAppointment_FA(String specialization, Timestamp bookingTime, int patientId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String followupReason, String status, String description) {
        int doctorId = get_least_waiting_docId(specialization);
        if(doctorId==-1) return null;
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId, startTime, endTime, isFollowup, markForFollowup, followupReason, status, description);
        return appointmentRepository.save(appointment);
    }

    public Appointment createAppointment_A(String specialization,Timestamp bookingTime, int patientId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String followupReason, String status, String description) {
        int doctorId = get_least_waiting_docId(specialization);
        if(doctorId==-1) return null;
        Appointment appointment = new Appointment(bookingTime, patientId, doctorId,startTime, endTime, isFollowup, markForFollowup, followupReason, status, description);
        return appointmentRepository.save(appointment);
    }

    public Integer get_next_best_doc(int id){
        String spec = appointmentRepository.get_doc_spec_from_app(id);
        Integer doctorId = get_least_waiting_docId(spec);
        if(doctorId != -1) {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setDoctorId(doctorId);
                appointmentRepository.save(appointment);
            }
            return doctorId;
        }
        else return null;
    }
    public void setAppDescription(int appId, String desc){
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appId);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setDescription(desc);
            appointmentRepository.save(appointment);
        }
    }

    public String get_doc_spec(int docId){
        return appointmentRepository.get_doc_spec(docId);
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
