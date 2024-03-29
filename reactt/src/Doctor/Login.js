
import React, { useState,useCallback,useEffect,Component, useRef} from "react";
import { createSearchParams, useNavigate } from 'react-router-dom';

import './styles/Login.css'

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
      await fetch('http://localhost:8090/api/v1/doctor/get_doctor_by_mobile', {
        method: 'POST',
        headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(get_doc_by_mobile_body)
      })
      .then(response => {
        if (response['status'] == 401)
        {
          nav({
            pathname: '/login_doc'
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Doc Id assigned: ",data.doctorId)
        localStorage.setItem('d_doc_id',data.doctorId);
        nav('/DocHome');
        // // nav({
        // //   pathname: '/DocHome',
        // //   search: createSearchParams({
        // //     doc_id: data.doctorId
        // //   }).toString()
        // });
      })
      .catch(error => {
        console.log("error fetching id")
        console.log(error)
      });
    }
    else if(data == 'true')
    {
      localStorage.setItem('d_mobile', phone);
      nav('/register_doc');
      
      // nav({
      //   pathname: '/register_doc',
      //   search: createSearchParams({
      //     mobile: phone
      //   }).toString()
      // });
    }

  }

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const goBack = () =>{
    nav('/')
  }
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
    .then(response => {
      if (response['status'] == 401)
      {
        nav({
          pathname: '/login_doc'
        });
      }
      return response.text();
    })
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
    .then(response => {
      if (response['status'] == 401)
      {
        nav({
          pathname: '/login_doc'
        });
      }
      return response.text();
    })
    .then(async(data) => {
      console.log(data)
      localStorage.setItem('jwtToken_doc', data);
      // if(data == "approved")
      if(true)
      {
        const check_new_user_body = {
          'mobile_number' : phone
        }
        await fetch('http://localhost:8090/api/v1/doctor/check_new_mobile', {
          method: 'POST',
          headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),

            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
          body: JSON.stringify(check_new_user_body)
        })
        .then(response => {
          if (response['status'] == 401)
          {
            nav({
              pathname: '/login_doc'
            });
          }
          return response.text();
        })
        .then(data => {
          console.log("New User?",data);
          feedback(data);
        })
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
    <div style={{height:'100vh'}}>
      <button className="login-go-back-btn" onClick={goBack}>Go back</button>
      <div className="login-center">
          <h1>Doctor Login</h1>
          <form  method="post">
            <div className="txt_field">
              <input type="number" value={phone} onChange={handlePhoneChange} required/>
              <span></span>
              <label>Mobile Number</label>
            </div>
            {showOtp? (
              <>
                <div className="txt_field">
                  <input value={otp} onChange={handleOtpChange} type="password"  required/>
                  <span></span>
                  <label>OTP</label>
                </div>
              </>
            ):null}

            
            {/* <input type="submit" value="Login"/> */}

            {(!showOtp)?(
                <button className="login-otp-button" onClick={handleSendOtpClick}>Send OTP</button>
              ):null}

          {showOtp? (
          <>
            <button className="login-otp-button" onClick={handleLoginClick}>Login</button>
            <div className="signup_link"><a href="#" onClick={handleSendOtpClick}>Resend OTP ?</a></div>

          {/* {console.log(timerout)} */}
          </>): null}
          </form>
        </div>
    </div>
    
  );
}

export default Logindoc;
