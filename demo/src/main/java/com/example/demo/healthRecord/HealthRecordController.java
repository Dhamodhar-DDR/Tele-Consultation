package com.example.demo.healthRecord;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/health_records")
public class HealthRecordController {
    private final HealthRecordService healthRecordService;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    //    @Autowired
    public HealthRecordController(HealthRecordService healthRecordService) { this.healthRecordService = healthRecordService; }

    @CrossOrigin
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") List<MultipartFile> files,
                                              @RequestParam("names") List<String> names,
                                              @RequestParam("descriptions") List<String> descriptions,
                                              @RequestParam("patId") Integer patientId,
                                              @RequestParam("appId") Integer appointmentId) {
        System.out.println("didn't");
        try {
            healthRecordService.uploadRecord(files,names,descriptions,patientId,appointmentId);
            System.out.println("no prob");
            return ResponseEntity.ok("Files uploaded successfully");
        } catch (Exception e) {
            System.out.println("except");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload files");
        }
    }

    @CrossOrigin
    @PostMapping("/get_record_by_hr_id")
    public ResponseEntity<byte[]> getRecordByHrId(@RequestParam("hr_id") Integer hr_id) {
        return healthRecordService.getRecordByHrId(hr_id);
    }

    @CrossOrigin
    @PostMapping("/get_record_by_app_id")
    public List<ResponseEntity<HealthRecordService.fileObj>> getRecordByAppId(@RequestParam("app_id") Integer app_id) {
        return healthRecordService.getRecordByAppId(app_id);
    }

    @CrossOrigin
    @PostMapping("/get_record_by_pat_id")
    public List<ResponseEntity<HealthRecordService.fileObj>> getRecordByPatId(@RequestParam("pat_id") Integer pat_id) {
            return healthRecordService.getRecordByPatId(pat_id);
    }


}
