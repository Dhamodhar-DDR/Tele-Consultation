package com.example.demo.authentication.jwtutils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.demo.patient.PatientRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final PatientRepository pr;
    public JwtUserDetailsService(PatientRepository pr){
        this.pr = pr;
    }
    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>(2);
        authList.add(new SimpleGrantedAuthority("verify_otp"));
        User userByName = new User(mobile, "123456", authList);
        return new org.springframework.security.core.userdetails.User(userByName.getUsername(), userByName.getPassword(), userByName.getAuthorities());
    }
}