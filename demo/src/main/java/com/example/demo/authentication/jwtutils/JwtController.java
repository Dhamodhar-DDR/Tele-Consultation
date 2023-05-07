package com.example.demo.authentication.jwtutils;
import com.twilio.http.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.demo.authentication.jwtutils.models.JwtRequestModel;
import com.example.demo.authentication.jwtutils.models.JwtResponseModel;
import com.example.demo.authentication.AuthenticationService;
import org.springframework.security.core.Authentication;

import java.util.Objects;

@RestController
@RequestMapping(value = "/api/v1/auth")
public class JwtController {
    private final AuthenticationService authenticationService;
    public JwtController(AuthenticationService authenticationService)
    {
        this.authenticationService = authenticationService;
    }
    @Autowired
    private JwtUserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenManager tokenManager;

    record verify_otp_body(String mobile_number,String otp){}
    @CrossOrigin
    @PostMapping("/verify_otp")
    public ResponseEntity createToken(@RequestBody verify_otp_body verify_otp_rec) {

        String auth = authenticationService.verify_otp(verify_otp_rec.otp,verify_otp_rec.mobile_number);
        System.out.println("reached: "+ auth);

        if (Objects.equals(auth, "approved")) {
            System.out.println("entered");
            final UserDetails userDetails = userDetailsService.loadUserByUsername(verify_otp_rec.mobile_number);
            final String jwtToken = tokenManager.generateJwtToken(userDetails);
        /*System.out.println("hellso");
        System.out.println(jwtToken);
        //System.out.println());
        return ResponseEntity.ok(new JwtResponseModel(jwtToken));*/
            System.out.println(jwtToken);
            return ResponseEntity.ok(new JwtResponseModel(jwtToken));
        }
        else
        {
            return ResponseEntity.ok(new JwtResponseModel("not"));
        }
        //return auth;
    }
}
