package com.example.demo.prescription;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {
    private PrescriptionRepository prescriptionRepository;

    //    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository){
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<Prescription> get_prescription(Integer appId) {
        return prescriptionRepository.findByAppId(appId);
    }

    public Boolean add_prescriptions(Integer appId, List<String> medNames, List<String> frequencies, List<String> descriptions) {
        for(int i =0;i<medNames.toArray().length;i++) {
            Prescription pr = new Prescription(appId, medNames.get(i), frequencies.get(i), descriptions.get(i));
            prescriptionRepository.save(pr);
        }
        return true;
    }

}
