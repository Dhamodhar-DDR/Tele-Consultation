package com.example.demo.healthRecord;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class HealthRecordService {
    private final HealthRecordRepository healthRecordRepository;

    //    @Autowired
    public HealthRecordService(HealthRecordRepository healthRecordRepository){
        this.healthRecordRepository = healthRecordRepository;
    }

    public static String getFileType(byte[] fileData) {
        if (fileData.length >= 4 && fileData[0] == (byte)0x89 && fileData[1] == (byte)0x50 &&
                fileData[2] == (byte)0x4E && fileData[3] == (byte)0x47) {
            return "image/png";
        } else if (fileData.length >= 4 && fileData[0] == (byte)'%' && fileData[1] == (byte)'P' &&
                fileData[2] == (byte)'D' && fileData[3] == (byte)'F') {
            return "application/pdf";
        } else {
            return null;
        }
    }

    public boolean uploadRecord(List<MultipartFile> files, List<String> names, List<String> descriptions, Integer patientId, Integer appointmentId){
        try{
            for(int i = 0;i<files.toArray().length;i++)
            {
                HealthRecord healthRecord = new HealthRecord(patientId, appointmentId, names.get(i), descriptions.get(i), files.get(i).getBytes());
                healthRecordRepository.save(healthRecord);
            }
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    public ResponseEntity<byte[]> getRecordByHrId(Integer hr_id){
        HealthRecord hr = healthRecordRepository.findByHrId(hr_id);
        byte[] fileData = hr.getFile();
//        String fileBase64 = Base64.getEncoder().encodeToString(fileData);
        String fileType = getFileType(fileData);
        if (fileType != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(fileType));
            return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public List<ResponseEntity<byte[]>> getRecordByAppId(Integer hr_id){
        List<ResponseEntity<byte[]>> list = new ArrayList<ResponseEntity<byte[]>>();
        List<HealthRecord> list_hr = healthRecordRepository.findByAppId(hr_id);
        for(int i = 0;i<list_hr.toArray().length;i++)
        {
            byte[] fileData = list_hr.get(i).getFile();
            String fileType = getFileType(fileData);
            if (fileType != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(fileType));
                list.add(new ResponseEntity<>(fileData, headers, HttpStatus.OK));
            } else {
                list.add(new ResponseEntity<>(HttpStatus.NOT_FOUND));
            }
        }
        return list;
    }

    public List<ResponseEntity<byte[]>> getRecordByPatId(Integer hr_id){
        List<ResponseEntity<byte[]>> list = new ArrayList<ResponseEntity<byte[]>>();
        List<HealthRecord> list_hr = healthRecordRepository.findByPatientId(hr_id);
        for(int i = 0;i<list_hr.toArray().length;i++)
        {
            byte[] fileData = list_hr.get(i).getFile();
            String fileType = getFileType(fileData);
            if (fileType != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(fileType));
                list.add(new ResponseEntity<>(fileData, headers, HttpStatus.OK));
            } else {
                list.add(new ResponseEntity<>(HttpStatus.NOT_FOUND));
            }
        }
        return list;
    }

}
