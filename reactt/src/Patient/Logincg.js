
import React, { useState} from "react";
import { createSearchParams,useSearchParams, useNavigate } from 'react-router-dom';

import './Logincg.css'

function Logincg() {

  const nav = useNavigate();


  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [valid, setvalid] = useState(false);
  const[clickLogin, setclickLogin] = useState(false);
  const[timerout, settimrout] = useState(true);
  const[login_approved, setloginapproved] = useState(-1);

  const feedback = (data) => {
    
    if(data == 'false')
    {
      nav({
        pathname: '/selectprofile',
        search: createSearchParams({
          mobile: phone
        }).toString()
      });
    }
    else if(data == 'true')
    {
      nav({
        pathname: '/register_p',
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

    // const send_otp_body = {
    //   'mobile_number' : phone
    // }

    // await fetch('http://localhost:8090/api/v1/auth/send_otp', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*' 
    //   },
    //   body: JSON.stringify(send_otp_body)
    // })
    // .then(response => response.text())
    // .then(data => {
    //   console.log(data)
    // })
    // .catch(error => {
    //   console.log(error)
    // });
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setclickLogin(true);

    // const verify_otp_body = {
    //   'mobile_number' : phone,
    //   'otp': otp
    // }
    // await fetch('http://localhost:8090/api/v1/auth/verify_otp', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*' 
    //   },
    //   body: JSON.stringify(verify_otp_body)
    // })
    // .then(response => response.text())
    // .then(async(data) => {
    //   console.log(data)
    
      if(true)
      // if(data == "approved")
      {
        setloginapproved(1);
      
        const check_new_user_body = {
          'mobile_number' : phone
        }
    
        await fetch('http://localhost:8090/api/v1/patient/check_new_user', {
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
        })
      }
      else 
      {
        setloginapproved(2);
        return(<p> You've entered invalid OTP. Please Try again !</p>);                
      }

    // })
    // .catch(error => {
    //   return(<p> You've entered invalid OTP. Please Try again !</p>); 
    //   console.log(error)
    // });
  };

  return (
    <div className="container">
      <h1>Patient Login</h1>
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
          <button className="Login-doc-button" onClick={handleSendOtpClick}>Send OTP</button>
        ):null}

        {showOtp? (
          <>
          <button className="Login-doc-button" onClick={handleLoginClick}>Login</button> <br/>
          <button className="Login-doc-button" onClick={handleSendOtpClick}>Resend OTP</button>

          {
           (login_approved == 2)?(
            
            <>
            
            <br/>
            <p style={{color:"red"}}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  You've entered invalid OTP. Please Try again !</p>

            </>

           ):null

           }
          {/* {console.log(timerout)} */}
          </>
          
        ): null}



      </form>
    </div>
  );
}

export default Logincg;
