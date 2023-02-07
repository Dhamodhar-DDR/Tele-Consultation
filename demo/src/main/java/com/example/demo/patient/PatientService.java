package com.example.demo.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class PatientService {
//    public List<Patient> list_student() {
//        return List.of(new Patient(1,"Dhamod2har",20,"9550660466"));
//    }
    private PatientRepository patientRepository;
    @Autowired
    public PatientService(PatientRepository patientRepository){
        this.patientRepository = patientRepository;
    }

    public List<Patient> list_student() {
        return patientRepository.findAll();
    }

    public Patient create_patient(int id, String name, int age, String mobile) {
        Patient p = new Patient();
        p.setId(id);
        p.setAge(age);
        p.setMobile(mobile);
        p.setName(name);
        return patientRepository.save(p);
    }

}
