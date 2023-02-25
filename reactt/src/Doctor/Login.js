
import React, { useState,useCallback,useEffect,Component, useRef} from "react";
import { createSearchParams, useNavigate } from 'react-router-dom';

import './Login.css'

function Logindoc() {

  const nav = useNavigate();


  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [valid, setvalid] = useState(false);
  const[clickLogin, setclickLogin] = useState(false);
  const[timerout, settimrout] = useState(true);
  

  const [count, setCount] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  const feedback = (data) => {

    console.log("data in feedback, ",data);
    console.log(typeof(data))
    console.log(data=='false')
    if(data == 'false')
    {
      console.log("Inside if")
      nav({
        
        pathname: '/DocHome',
        search: createSearchParams({
          mobile: phone
        }).toString()
      
      });
      // alert("Navigate to next page")
      
    }

    else if(data == 'true')
    {
      nav({
        
        pathname: '/register_doc',
        search: createSearchParams({
          mobile: phone
        }).toString()
      
      });

    }

  }

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtpClick = async (e) => {
    // startTimer();
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
    setclickLogin(true);

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
    .then(async(data) => {
      console.log(data)
    
      if(data === "approved")
      {
      

        const check_new_user_body = {
          'mobile_number' : phone
        }
    

        await fetch('http://localhost:8090/api/v1/doctor/check_new_mobile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
          body: JSON.stringify(check_new_user_body)
        })
        .then(response => response.text())
        .then(data => {

          console.log("New User?",data);
          
        feedback(data);
          
        
        }

        )


      }
      else 
      {
        return(<p> You've entered invalid OTP. Please Try again !</p>);                
      }

    })
    .catch(error => {
      return(<p> You've entered invalid OTP. Please Try again !</p>); 
      console.log(error)
    });
    


  };

  return (
    <div className="container">
      <h1>Online Medical Consultation</h1>
      <form>
        <label>Phone Number:</label>
        <input type="number" value={phone} onChange={handlePhoneChange} />

        {showOtp? (
          <>
            <label>OTP:</label>
            <input type="number" value={otp} onChange={handleOtpChange} />
          </>
        ):null}

        {(!showOtp)?(
          <button onClick={handleSendOtpClick}>Send OTP</button>
        ):null}

        {showOtp? (
          <>
          <button onClick={handleLoginClick}>Login</button> <br/>
          {/* {console.log(timerout)} */}
          <button onClick={handleSendOtpClick} disabled = {true}>Resend OTP ({count})</button>
          </>
          
        ): null}



      </form>
    </div>
  );
}

export default Logindoc;
