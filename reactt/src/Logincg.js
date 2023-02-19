
import React, { useState } from "react";

import './Logincg.css'

function Logincg() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtpClick = async (e) => {
    e.preventDefault();
    setShowOtp(true);

    const send_otp_body = {
      'mobile_number' : phone
    }

    await fetch('http://localhost:8090/api/v1/auth/send_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(send_otp_body)
    })
    .then(response => response.text())
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.log(error)
    });
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    const verify_otp_body = {
      'mobile_number' : phone,
      'otp': otp
    }
    await fetch('http://localhost:8090/api/v1/auth/verify_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(verify_otp_body)
    })
    .then(response => response.text())
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.log(error)
    });
  };

  return (
    <div className="container">
      <h1>Online Medical Consultation</h1>
      <form>
        <label>Phone Number:</label>
        <input type="number" value={phone} onChange={handlePhoneChange} />

        {showOtp && (
          <>
            <label>OTP:</label>
            <input type="number" value={otp} onChange={handleOtpChange} />
          </>
        )}

        {!showOtp && (
          <button onClick={handleSendOtpClick}>Send OTP</button>
        )}

        {showOtp && (
          <button onClick={handleLoginClick}>Login</button>
        )}
      </form>
    </div>
  );
}

export default Logincg;
