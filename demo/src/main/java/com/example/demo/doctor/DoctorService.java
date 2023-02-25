package com.example.demo.doctor;

import com.example.demo.doctor.Doctor;
import com.example.demo.doctor.DoctorRepository;
import com.example.demo.patient.Patient;
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


    public Doctor create_doctor(String name,String mobile,Boolean onlineStatus,int age,String experience,String specialization,String email, String gender) {
        Doctor doctor = new Doctor(name, mobile, onlineStatus, age, experience, specialization, email, gender);
        return doctorRepository.save(doctor);
    }

    public Boolean check_online_status(Integer doctorID) {
        Doctor doctor = doctorRepository.findByDoctorId(doctorID);
        return doctor.isOnlineStatus();
    }

    public Boolean set_online_status(Integer doctorID, Boolean onlineStatus) {
        Doctor doctor = doctorRepository.findByDoctorId(doctorID);
        doctor.setOnlineStatus(onlineStatus);
        doctorRepository.save(doctor);
        return true;
    }
    public List<Doctor> getOnlineDoctors() {
        return doctorRepository.findByOnlineStatusTrue();
    }

    public Doctor check_new_mobile(String mobile) {
        return doctorRepository.findByMobileNumber(mobile);
    }
}
