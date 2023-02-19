package com.example.demo.doctor;

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
    @GetMapping("/")
    public List<Doctor> list_student() {
        return this.doctorService.list_doctor();
    }

    record new_doctor_request(
            String name,
            String mobile
    ){}
    @PostMapping("/create")
    public Doctor create_patient(@RequestBody new_doctor_request ndr) {
        return this.doctorService.create_doctor(ndr.name,ndr.mobile);
    }
}