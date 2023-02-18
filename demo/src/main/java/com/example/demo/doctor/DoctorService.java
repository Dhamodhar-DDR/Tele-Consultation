package com.example.demo.doctor;

import com.example.demo.doctor.Doctor;
import com.example.demo.doctor.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DoctorService {

    private DoctorRepository doctorRepository;

    //    @Autowired
    public DoctorService(DoctorRepository doctorRepository){
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> list_doctor() {
        return doctorRepository.findAll();
    }

    public Doctor create_doctor(String name, String mobile) {
        Doctor doctor = new Doctor(name, mobile);
        return doctorRepository.save(doctor);
    }

}
