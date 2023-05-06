package com.example.demo.authentication;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private static final String ACCOUNT_SID = "ACc616d970b2af8dab101f3938ffb00617"; //System.getenv("ACbc91ba0b1ce5b5020130385133c2ae46");
    private static final String AUTH_TOKEN = "18a5c04e02abb377bf3c3b3cec7029ce"; //System.getenv("aa2cab81ac3f795ce2280dbe04659ef1");
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
                        "VAfe82c18c42a75b23ec1759b8cc987827",
                        "+91"+mobile_number,
                        "sms")
                .create();
        System.out.println(verification.getStatus());
        return verification.getStatus();
    }
    public String verify_otp(String otp, String mobile_number) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        VerificationCheck verificationCheck = VerificationCheck.creator(
                        "VAfe82c18c42a75b23ec1759b8cc987827")
                .setTo("+91"+mobile_number)
                .setCode(otp)
                .create();
        System.out.println(verificationCheck.getStatus());
        return verificationCheck.getStatus();
    }
}
