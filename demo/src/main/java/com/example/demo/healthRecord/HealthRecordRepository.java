package com.example.demo.healthRecord;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer> {

    HealthRecord findByHrId(Integer hrId);

    List<HealthRecord> findByAppId(Integer appId);
    List<HealthRecord> findByPatientId(Integer patId);

}