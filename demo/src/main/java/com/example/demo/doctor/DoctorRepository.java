package com.example.demo.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    @Query(value = "SELECT * FROM DOCTOR",nativeQuery = true)
    List<Doctor> get_all_doctors();
    Doctor findByDoctorId(Integer doctorID);
    List<Doctor> findByOnlineStatusTrue();
    Doctor findByMobileNumber(String mobileNumber);
}
