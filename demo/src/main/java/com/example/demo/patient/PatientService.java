package com.example.demo.patient;

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
    public Patient get_patient_by_id(Integer patientID) {return patientRepository.findByPatientId(patientID);}

    public List<Patient> get_all_profiles(Integer patientID) {
        Patient p = patientRepository.findByPatientId(patientID);
        return patientRepository.findByMobileNumber(p.getMobileNumber());
    }

    public Patient add_new_profile(Integer patientID, String name, int age, String gender, String email, Boolean consent) {
        Patient old_patient = patientRepository.findByPatientId(patientID);
        Patient patient = new Patient( name, old_patient.getMobileNumber(),  age,  gender,  email ,consent);
        return patientRepository.save(patient);
    }

    public void add_newPatient(String name, String mobile, int age, String gender, String email, Boolean consent) {
        Patient patient = new Patient( name, mobile,  age,  gender,  email ,consent);
        patientRepository.addPatient(name, mobile, age, gender, consent, email
        );
    }
}
