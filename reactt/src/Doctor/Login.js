
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

  const feedback = async(data) => {

    // nav({
    //   pathname: '/DocHome',
    //   search: createSearchParams({
    //     doc_id: data.doctorId
    //   }).toString()
    // });

    if(data == 'false')
    {
      const get_doc_by_mobile_body = {
        'mobile_number': phone
      }
      await fetch('http://172.16.140.228:8090/api/v1/doctor/get_doctor_by_mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(get_doc_by_mobile_body)
      })
      .then(response => response.json())
      .then(data => {
        console.log("Doc Id assigned: ",data.doctorId)
        nav({
          pathname: '/DocHome',
          search: createSearchParams({
            doc_id: data.doctorId
          }).toString()
        });
      })
      .catch(error => {
        console.log("error fetching id")
        console.log(error)
      });
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

    // const send_otp_body = {
    //   'mobile_number' : phone
    // }

    // await fetch('http://172.16.140.228:8090/api/v1/auth/send_otp', {
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
    // await fetch('http://172.16.140.228:8090/api/v1/auth/verify_otp', {
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
      
      // if(data == "approved")
      if(true)
      {
        const check_new_user_body = {
          'mobile_number' : phone
        }
        await fetch('http://172.16.140.228:8090/api/v1/doctor/check_new_mobile', {
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
      <h1>Doctor Login</h1>
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
          {/* {console.log(timerout)} */}
          
          <button className="Login-doc-button" onClick={handleSendOtpClick} >Resend OTP</button>
          </>
          
        ): null}



      </form>
    </div>
    
  );
}

export default Logindoc;
