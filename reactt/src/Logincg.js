
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

  const handleSendOtpClick = (e) => {
    e.preventDefault();
    // TODO: Send OTP to the phone number
    setShowOtp(true);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    // TODO: Verify the OTP and log in the user
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
