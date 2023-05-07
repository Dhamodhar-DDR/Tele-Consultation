package com.example.demo.patient;
import jakarta.persistence.*;

@Entity
@Table(name = "Patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private int patientId;

    @Column(name = "name")
    private String name;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "dob")
    private String dob;

    @Column(name = "gender")
    private String gender;
    @Column(name = "email")
    private String email;

    @Column(name = "consent")
    private Boolean consent;

    // Constructor
    public Patient() {}

    public Patient(String name, String mobileNumber, String dob, String gender,String email ,Boolean consent) {
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.consent = consent;
    }


    // Getters and Setters
    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
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

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Boolean getConsent() {
        return consent;
    }

    public void setConsent(Boolean consent) {
        this.consent = consent;
    }
}