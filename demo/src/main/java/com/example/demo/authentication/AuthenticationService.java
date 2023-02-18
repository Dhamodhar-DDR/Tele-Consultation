package com.example.demo.authentication;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private static final String ACCOUNT_SID = "ACbc91ba0b1ce5b5020130385133c2ae46"; //System.getenv("ACbc91ba0b1ce5b5020130385133c2ae46");
    private static final String AUTH_TOKEN = "aa2cab81ac3f795ce2280dbe04659ef1"; //System.getenv("aa2cab81ac3f795ce2280dbe04659ef1");
    public void create_service() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        com.twilio.rest.verify.v2.Service service = com.twilio.rest.verify.v2.Service.creator("My First Verify Service").create();
        System.out.println("Verificatio=======]n Service Created!");
        System.out.println(service.getSid());
        String service_sid = service.getSid();
    }
    public String send_otp() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Verification verification = Verification.creator(
                        "VAe7a8961bee78f7920d14ec2ce79d82c1",
                        "+919550660466",
                        "sms")
                .create();
        System.out.println(verification.getStatus());
        return verification.getStatus();
    }
    public String verify_otp(String otp) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        "VAe7a8961bee78f7920d14ec2ce79d82c1")
                .setTo("+919550660466")
                .setCode(otp)
                .create();
        System.out.println(verificationCheck.getStatus());
        return verificationCheck.getStatus();
    }
}
