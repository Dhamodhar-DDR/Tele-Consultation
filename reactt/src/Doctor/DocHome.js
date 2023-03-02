

import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';


import './DocHome.css'


function DocHome() {

  const [isConsultationActive, setIsConsultationActive] = useState(false);

  const [doc_id, setDoc_id] = useState(-1);

  const get_docId = async(get_doc_by_mobile_body) => {

    await fetch('http://localhost:8090/api/v1/doctor/get_doctor_by_mobile', {
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
      setDoc_id(data.doctorId)
      // console.log(doc_id)
      get_online_stat(data.doctorId)
    })
    .catch(error => {
      console.log("error fetching id")
      console.log(error)
    });
  }

  const get_online_stat = async(doc_id_param) => {
    const check_status_body = {
      'doctorID': doc_id_param
    }
    await fetch('http://localhost:8090/api/v1/doctor/check_online_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(check_status_body)
    })
    .then(response => response.json())
    .then(data => {
      console.log(check_status_body);
      console.log("Online Status: ",data)
      setIsConsultationActive(data);
    })
    .catch(error => {
      console.log("error getting online status")
      console.log(error)
    });
  }


  useEffect(() => {
    console.log("Received num: ", searchParams.get("mobile"));
    const get_doc_by_mobile_body = {

      'mobile_number': searchParams.get("mobile")
    }
    get_docId(get_doc_by_mobile_body)
    
  
    // await fetch('http://localhost:8090/api/v1/doctor/get_doctor_by_mobile', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*' 
    //   },
    //   body: JSON.stringify(get_doc_by_mobile_body)
    // })
    // .then(response => response.text())
    // .then(data => {
    //   console.log("Doc Id assigned: ",data)
    //   setDoc_id(data)
    // })
    // .catch(error => {
    //   console.log("error fetching id")
    //   console.log(error)
    // });
  
  }, []);

const[searchParams] = useSearchParams();

const nav = useNavigate()

const HandleLogout = () =>{

  set_status(false)
  nav('/login_doc')

  
}

const set_status = async(param) =>{

  const set_online_status_body = {

    'doctorID' : doc_id,
    'online_status': param      
  }
  console.log("bef await isconsulatationactive", param)

  await fetch('http://localhost:8090/api/v1/doctor/set_online_status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
    body: JSON.stringify(set_online_status_body)
  })
  .then(response => response.text())
  .then(data => {
    console.log("Online status: ",data)
    setIsConsultationActive(param)
  })
  .catch(error => {
    console.log(error)
  });




}

const Consultation_Button = () => {
  



  const toggleConsultation = () => {

    set_status(!isConsultationActive);


  }

  return (
    <div className="centered-button">
      <button
        className={`consultation-button ${isConsultationActive ? 'stop-consultation' : ''}`}
        onClick={toggleConsultation}
      >
        {isConsultationActive ? 'Stop Consultation' : 'Start Consultation'}
      </button>
    </div>
  );
}

  return (
    <div>
      {/* Navigation bar */}
      <div className="navbar">
        <div>
        <button className="nav-button">Home</button>
        <button className="nav-button">Edit Profile</button>
        <button className="nav-button">Appointment History</button>

          {/* <a href="#">Edit Profile</a>
          <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button" onClick={HandleLogout}>Logout</button>
        </div>
      </div>

      {/* Start Consultation button */}
      {/* <button className="button" id="startconsultation">Start Consultation</button> */}
      {
        Consultation_Button()
      }

      {/* Patients marked for follow up */}
    </div>
  );
}

export default DocHome;
