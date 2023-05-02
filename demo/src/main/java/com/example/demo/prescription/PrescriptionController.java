package com.example.demo.prescription;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    //    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService)
    {
        this.prescriptionService = prescriptionService;
    }
    record get_pres_body(
        Integer appId
    ){}

    record set_pres_body(
            Integer appId,
            List<String> medNames,
            List<String> frequencies,
            List<String> descriptions
    ){}
    @CrossOrigin
    @PostMapping("/get_prescription")
    public List<Prescription> get_prescriptions(@RequestBody get_pres_body gpb) {
        return this.prescriptionService.get_prescription(gpb.appId);
    }

    @CrossOrigin
    @PostMapping("/add_prescription")
    public Boolean add_prescriptions(@RequestBody set_pres_body gpb) {
        return this.prescriptionService.add_prescriptions(gpb.appId, gpb.medNames, gpb.frequencies, gpb.descriptions);
    }

}
