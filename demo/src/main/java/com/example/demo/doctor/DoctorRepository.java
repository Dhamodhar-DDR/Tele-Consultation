package com.example.demo.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
//    @Query(value = "SELECT * FROM DOCTOR",nativeQuery = true)
    @Query(value = "SELECT doctor_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, online_status, age, experience, specialization, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email, gender FROM DOCTOR",nativeQuery = true)
    List<Doctor> get_all_doctors();
    @Query(value = "SELECT doctor_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, online_status, age, experience, specialization, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email, gender FROM DOCTOR WHERE doctor_id=:doctorID",nativeQuery = true)
    Doctor findByDoctorId(Integer doctorID);
    @Query(value = "SELECT doctor_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, online_status, age, experience, specialization, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email, gender FROM DOCTOR WHERE online_status=1",nativeQuery = true)
    List<Doctor> findByOnlineStatusTrue();
    @Query(value = "SELECT doctor_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, online_status, age, experience, specialization, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email, gender FROM DOCTOR WHERE mobile_number=cast(to_base64(AES_ENCRYPT(:mobileNumber ,'mykeystring')) as char)",nativeQuery = true)
    Doctor findByMobileNumber(String mobileNumber);
    @Modifying
    @Query(value="UPDATE DOCTOR SET online_status =:online_status WHERE doctor_id=:doctorID", nativeQuery = true)
    void setOnline_Status(@Param(value ="online_status") Boolean online_status, @Param(value="doctorID") Integer doctorID);
    @Modifying
    @Query(value="INSERT INTO DOCTOR (name, mobile_number, online_status, age, experience, gender, specialization, email) VALUES (cast(to_base64(AES_ENCRYPT(:name ,'mykeystring')) as char), cast(to_base64(AES_ENCRYPT(:mobile ,'mykeystring')) as char), :online_status, :age, :experience, :gender, :specialization, (cast(to_base64(AES_ENCRYPT(:email ,'mykeystring')) as char)))", nativeQuery = true)
    void addPatient(@Param(value = "name") String name, @Param(value = "mobile") String mobile, @Param(value = "online_status") Boolean online_status, @Param(value = "age") int age, @Param(value = "experience") String experience, @Param(value = "gender") String gender, @Param(value = "specialization") String specialization, @Param(value = "email") String email);

}
