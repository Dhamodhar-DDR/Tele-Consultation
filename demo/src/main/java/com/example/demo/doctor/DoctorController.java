package com.example.demo.doctor;

import com.example.demo.patient.Patient;
import com.example.demo.patient.PatientController;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping(value = "/api/v1/doctor")
public class DoctorController {
    private final DoctorService doctorService;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    //    @Autowired
    public DoctorController(DoctorService doctorService)
    {
        this.doctorService = doctorService;
    }

    record new_doctor_request(
            String name,
            String mobile,
            int age,
            String specialization,
            String experience,
            String email,
            String gender,
            Boolean onlineStatus
    ){}


    record check_online_status_body(Integer doctorID){}
    record check_new_mobile_body(String mobile_number){}

    record set_online_status_body(Integer doctorID, Boolean online_status){}

    @GetMapping("/")
    public List<Doctor> list_patients() {
        return this.doctorService.list_doctor();
    }

    @CrossOrigin
    @PostMapping("/add_doctor")
    public Doctor create_doctor(@RequestBody new_doctor_request ndr) {
        return this.doctorService.create_doctor(ndr.name,ndr.mobile,ndr.onlineStatus,ndr.age,ndr.experience,ndr.specialization,ndr.email,ndr.gender);
    }

    @CrossOrigin
    @PostMapping("/check_new_mobile")
    public Boolean check_new_mobile(@RequestBody check_new_mobile_body cnmb) {
        Doctor doc = this.doctorService.check_new_mobile(cnmb.mobile_number);
        if(doc == null) return true;
        else return false;
    }

    @CrossOrigin
    @PostMapping("/get_doctor_by_mobile")
    public Doctor get_doctor_by_mobile(@RequestBody check_new_mobile_body cnmb) {
        return this.doctorService.check_new_mobile(cnmb.mobile_number);
    }
    @CrossOrigin
    @PostMapping("/get_doctor_by_id")
    public Doctor get_doctor_by_doc_id(@RequestBody check_online_status_body cosb) {
        return this.doctorService.get_doctor_by_id(cosb.doctorID);
    }

    @CrossOrigin
    @PostMapping("/check_online_status")
    public Boolean check_online_status(@RequestBody check_online_status_body cosb) {
        return this.doctorService.check_online_status(cosb.doctorID);
    }

    @CrossOrigin
    @PostMapping("/set_online_status")
    public Boolean set_online_status(@RequestBody set_online_status_body sosb) {
        return this.doctorService.set_online_status(sosb.doctorID, sosb.online_status);
    }

    @CrossOrigin
    @GetMapping("/get_online_doctors")
    public List<Doctor> getOnlineDoctors() {
        return doctorService.getOnlineDoctors();
    }

}