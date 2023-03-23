package com.example.demo.appointment;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "Appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private int appointmentId;

    @Column(name = "booking_time", nullable = false)
    private Timestamp bookingTime;

    @Column(name = "patient_id", nullable = false)
    private int patientId;

    @Column(name = "doctor_id")
    private String doctorId;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "is_followup", nullable = false)
    private boolean isFollowup;

    @Column(name = "mark_for_followup", nullable = false)
    private boolean markForFollowup;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "description")
    private String description;
    public Appointment(){};

    public Appointment(Timestamp bookingTime, int patientId, String doctorId, Timestamp startTime, Timestamp endTime, boolean isFollowup, boolean markForFollowup, String status, String description) {
        this.bookingTime = bookingTime;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isFollowup = isFollowup;
        this.markForFollowup = markForFollowup;
        this.status = status;
        this.description = description;

    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Timestamp getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(Timestamp bookingTime) {
        this.bookingTime = bookingTime;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public boolean isFollowup() {
        return isFollowup;
    }

    public void setFollowup(boolean followup) {
        isFollowup = followup;
    }

    public boolean isMarkForFollowup() {
        return markForFollowup;
    }

    public void setMarkForFollowup(boolean markForFollowup) {
        this.markForFollowup = markForFollowup;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

