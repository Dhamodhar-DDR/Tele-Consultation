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
//    @Autowired
    private PatientRepository patientRepository;

//    @Autowired
    public PatientService(PatientRepository patientRepository){
        this.patientRepository = patientRepository;
    }

    public List<Patient> list_patient() {
        return patientRepository.findAll();
    }

    public Patient create_patient(String name, String mobile, int age, String gender, String email, Boolean consent) {
        Patient patient = new Patient( name, mobile,  age,  gender,  email ,consent);
        return patientRepository.save(patient);
    }

    public List<Patient> check_new_user(String mobile) { return patientRepository.findByMobileNumber(mobile); }


}
