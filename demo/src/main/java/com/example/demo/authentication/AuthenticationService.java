package com.example.demo.authentication;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
<<<<<<< HEAD
    private static final String ACCOUNT_SID = "AC3a2109e5fd2a1585faa0d32e2b2361ef"; //System.getenv("ACbc91ba0b1ce5b5020130385133c2ae46");
    private static final String AUTH_TOKEN = "6273aababb5968e5a04fa9169ecde5da"; //System.getenv("aa2cab81ac3f795ce2280dbe04659ef1");
=======
    private static final String ACCOUNT_SID = "ACbc91ba0b1ce5b5020130385133c2ae46"; //System.getenv("ACbc91ba0b1ce5b5020130385133c2ae46");
    private static final String AUTH_TOKEN = "c8c306742827114f0733d594d4666c61"; //System.getenv("aa2cab81ac3f795ce2280dbe04659ef1");
>>>>>>> 5f2cb183a1b5b9efd5bfeec842f797eedc283acd
    public void create_service() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        com.twilio.rest.verify.v2.Service service = com.twilio.rest.verify.v2.Service.creator("My First Verify Service").create();
        System.out.println("Verification Service Created!");
        System.out.println(service.getSid());
        String service_sid = service.getSid();
    }
    public String send_otp(String mobile_number) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Verification verification = Verification.creator(
                        "VAe7a8961bee78f7920d14ec2ce79d82c1",
                        "+91"+mobile_number,
                        "sms")
                .create();
        System.out.println(verification.getStatus());
        return verification.getStatus();
    }
    public String verify_otp(String otp, String mobile_number) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        "VAe7a8961bee78f7920d14ec2ce79d82c1")
                .setTo("+91"+mobile_number)
                .setCode(otp)
                .create();
        System.out.println(verificationCheck.getStatus());
        return verificationCheck.getStatus();
    }
}
