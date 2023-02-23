package com.example.demo.doctor;
import jakarta.persistence.*;

@Entity
@Table(name = "Doctor")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctorId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "mobile_number", nullable = false, unique = true)
    private String mobileNumber;

    @Column(name = "online_status", nullable = false)
    private Boolean onlineStatus;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "experience")
    private String experience;

    @Column(name = "specialization", nullable = false)
    private String specialization;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private String gender;

    public Doctor() {}

    public Doctor(String name, String mobileNumber, Boolean onlineStatus, int age , String experience, String specialization, String email, String gender) {
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.onlineStatus = onlineStatus;
        this.age = age;
        this.experience = experience;
        this.specialization = specialization;
        this.email = email;
        this.gender = gender;
    }

    // Getters and setters
    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
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

    public Boolean isOnlineStatus() {
        return onlineStatus;
    }

    public void setOnlineStatus(Boolean onlineStatus) {
        this.onlineStatus = onlineStatus;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
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
}