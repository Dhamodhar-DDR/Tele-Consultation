package com.example.demo.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query(value = "SELECT patient_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, age, gender, consent, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email FROM PATIENT",nativeQuery = true)
    List<Patient> get_all_patients();
    @Query(value = "SELECT patient_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, age, gender, consent, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email FROM PATIENT where mobile_number=cast(to_base64(AES_ENCRYPT(:mobile ,'mykeystring')) as char)", nativeQuery = true)
    List<Patient> findByMobileNumber(@Param(value = "mobile") String mobileNumber);
//    @Query(value = "SELECT patient_id FROM patient", nativeQuery = true)
    @Query(value = "SELECT patient_id, cast(AES_DECRYPT(from_base64(name), 'mykeystring') as char) as name, cast(AES_DECRYPT(from_base64(mobile_number), 'mykeystring') as char) as mobile_number, age, gender, consent, cast(AES_DECRYPT(from_base64(email), 'mykeystring') as char) as email FROM PATIENT where patient_id=:PatientId", nativeQuery = true)
    Patient findByPatientId(Integer PatientId);
    @Modifying
    @Query(value="INSERT INTO PATIENT (name, mobile_number, age, gender, consent, email) VALUES (cast(to_base64(AES_ENCRYPT(:name ,'mykeystring')) as char), cast(to_base64(AES_ENCRYPT(:mobile ,'mykeystring')) as char), :age, :gender, :consent, cast(to_base64(AES_ENCRYPT(:email ,'mykeystring')) as char))", nativeQuery = true)
    void addPatient(@Param(value = "name") String name, @Param(value = "mobile") String mobile, @Param(value = "age") int age, @Param(value = "gender") String gender, @Param(value = "consent") Boolean consent, @Param(value = "email") String email);

}


