package com.example.demo.patient;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
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
            String dob,
            String mobile,
            String gender,

            String email,

            Boolean consent
    ){}

    record new_profile_request(
            Integer pat_id,
            String name,
            String dob,
            String gender,

            String email,

            Boolean consent
    ){}
    @CrossOrigin
    @Transactional
    @PostMapping("/create")
    public void create_patient(@RequestBody new_patient_request npr) {
        this.patientService.add_newPatient(npr.name,npr.mobile,npr.dob, npr.gender, npr.email, npr.consent);
    }

    record check_new_user_body (String mobile_number) {}
    record get_patient_by_id_body (Integer pat_id) {}
    @CrossOrigin
    @PostMapping("/check_new_user")
    public Boolean check_new_user(@RequestBody check_new_user_body cnub) {
        List<Patient> p = this.patientService.check_new_user(cnub.mobile_number);
        if(p.size() == 0) return true;
        else return false;
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/display_profiles")
    public List<Patient> display_profiles(@RequestBody check_new_user_body cnub) {
         return this.patientService.check_new_user(cnub.mobile_number);
    }

    @CrossOrigin
    @PostMapping("/get_patient_by_id")
    public Patient get_patient_by_id(@RequestBody get_patient_by_id_body gpbib) {
        return this.patientService.get_patient_by_id(gpbib.pat_id);
    }

    @CrossOrigin
    @PostMapping("/get_all_profiles")
    public List<Patient> get_all_profiles(@RequestBody get_patient_by_id_body reqbod) {
        return this.patientService.get_all_profiles(reqbod.pat_id);
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/add_new_profile")
    public void add_new_profile(@RequestBody new_profile_request npr) {
        this.patientService.add_new_profile(npr.pat_id,npr.name,npr.dob, npr.gender, npr.email, npr.consent);
    }
}