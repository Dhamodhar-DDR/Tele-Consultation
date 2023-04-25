package com.example.demo.healthRecord;
import jakarta.persistence.*;

@Entity
@Table(name = "Health_Record")
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hr_id")
    private int hrId;

    @Column(name = "patient_id")
    private int patientId;

    @Column(name = "app_id")
    private Integer appId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "file", nullable = false, columnDefinition = "BLOB")
    private byte[] file;

    // Constructor(s), getters and setters

    public HealthRecord() {
    }

    public HealthRecord(int patientId, Integer appId, String name, String description, byte[] file) {
        this.patientId = patientId;
        this.appId = appId;
        this.name = name;
        this.description = description;
        this.file = file;
    }

    // Getters and Setters

    public int getId() {
        return hrId;
    }

    public void setId(int hrId) {
        this.hrId = hrId;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public Integer getAppId() {
        return appId;
    }

    public void setAppId(Integer appId) {
        this.appId = appId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
