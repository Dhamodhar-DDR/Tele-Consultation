package com.example.demo.authentication;

import com.example.demo.authentication.jwtutils.JwtAuthenticationEntryPoint;
import com.example.demo.authentication.jwtutils.JwtFilter;
import com.example.demo.authentication.jwtutils.JwtUserDetailsService;
import com.example.demo.authentication.jwtutils.TokenManager;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/v1/auth") //check apv1doctor request

public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final TokenManager tokenManager;
    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    public AuthenticationController(AuthenticationService authenticationService)
    {
        this.authenticationService = authenticationService;
        tokenManager = new TokenManager();
    }
    record send_otp_body(String mobile_number){}
    @CrossOrigin
    @PostMapping("/send_otp")
    public String send_otp(@RequestBody send_otp_body send_otp_rec)
    {
        System.out.println("Hello?");
        return authenticationService.send_otp(send_otp_rec.mobile_number);
    }

    /*record verify_otp_body(String mobile_number,String otp){}
    @CrossOrigin
    @PostMapping("/verify_otp")
    public String verify_otp(@RequestBody verify_otp_body verify_otp_rec)
    {
        return authenticationService.verify_otp(verify_otp_rec.otp,verify_otp_rec.mobile_number);
    }*/
    @Autowired
    JwtUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtFilter authenticationJwtTokenFilter() {
        return new JwtFilter(tokenManager, userDetailsService);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests().requestMatchers("/api/v1/auth/verify_otp").permitAll()
                .requestMatchers("/api/v1/auth/send_otp").permitAll()
                .anyRequest().authenticated();

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}