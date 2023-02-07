package com.example.demo.patient;
import jakarta.persistence.*;

@Entity
@Table(name = "patient")
public class Patient {
    @Id
    @Column(name = "id")
    private int id;
    @Column(name = "age")
    private int age;
    @Column(name = "name")
    private String name;
    @Column(name = "mobile")
    private String mobile;

    public Patient(){

    }
    public Patient(int id, String name,int age, String mobile){
        this.id = id;
        this.name = name;
        this.age = age;
        this.mobile = mobile;
    }

    public int getId(){
        return id;
    }
    public int getAge() {
        return age;
    }

    public String getMobile() {
        return mobile;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setName(String name) {
        this.name = name;
    }
}
