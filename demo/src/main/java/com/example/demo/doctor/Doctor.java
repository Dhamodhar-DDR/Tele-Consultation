package com.example.demo.doctor;
import jakarta.persistence.*;

@Entity
@Table(name = "Doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private int doctorId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "mobile_number", nullable = false, unique = true)
    private String mobileNumber;

    public Doctor() {}

    public Doctor(String name, String mobileNumber) {
        this.name = name;
        this.mobileNumber = mobileNumber;
    }

    // Getters and setters

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
}