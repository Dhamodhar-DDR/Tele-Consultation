package com.example.demo.authentication;

import com.example.demo.patient.PatientService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping(value = "/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }

    public AuthenticationController(AuthenticationService authenticationService)
    {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/send_otp")
    public String send_otp()
    {
        return authenticationService.send_otp();
    }

    record otp_body(
            String otp
    ){}
    @PostMapping("/verify_otp")
    public String verify_otp(@RequestBody otp_body otp_rec)
    {
        return authenticationService.verify_otp(otp_rec.otp);
    }

}
