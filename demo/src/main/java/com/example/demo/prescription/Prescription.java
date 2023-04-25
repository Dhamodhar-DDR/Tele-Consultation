package com.example.demo.prescription;
import jakarta.persistence.*;

@Entity
@Table(name = "Prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pres_id")
    private int presId;
    @Column(name = "app_id")
    private Integer appId;

    @Column(name = "med_name")
    private String medName;

    @Column(name = "quantity")
    private String quantity;

    @Column(name = "description")
    private String description;

    public Prescription(){};
    public Prescription(Integer appId, String medName, String quantity, String description) {
        this.appId = appId;
        this.medName = medName;
        this.quantity = quantity;
        this.description = description;
    }
    public int getPresId() {
        return presId;
    }

    public void setPresId(int presId) {
        this.presId = presId;
    }

    public int getAppId() {
        return appId;
    }

    public void setAppId(int appId) {
        this.appId = appId;
    }

    public String getMedName() {
        return medName;
    }

    public void setMedName(String medName) {
        this.medName = medName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // constructors
    // toString() method

}