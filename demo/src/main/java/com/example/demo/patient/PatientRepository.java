package com.example.demo.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query(value = "SELECT * FROM PATIENT",nativeQuery = true)
    List<Patient> get_all_patients();
    List<Patient> findByMobileNumber(String mobileNumber);

}


