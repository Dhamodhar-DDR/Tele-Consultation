package com.example.demo.patient;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping(value = "/api/v1/patient")
public class PatientController {
    private final PatientService patientService;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
//    @Autowired
    public PatientController(PatientService patientService)
    {
        this.patientService = patientService;
    }
    @GetMapping("/")
    public List<Patient> list_patient() {
        return this.patientService.list_patient();
    }

    record new_patient_request(
            String name,
            int age,
            String mobile,
            String gender,
            Boolean consent
    ){}
    @PostMapping("/create")
    public Patient create_patient(@RequestBody new_patient_request npr) {
        return this.patientService.create_patient(npr.name,npr.mobile,npr.age, npr.gender, npr.consent);
    }

    record check_new_user_body (String mobile) {}
    @PostMapping("/check_new_user")
    public Boolean check_new_user(@RequestBody check_new_user_body cnub) {
        Patient p = this.patientService.check_new_user(cnub.mobile);
        if(p == null) return true;
        else return false;
    }
}



