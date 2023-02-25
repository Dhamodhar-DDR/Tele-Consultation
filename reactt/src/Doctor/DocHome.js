

import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';


import './DocHome.css'


function DocHome() {

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
    })
    .catch(error => {
      console.log("error fetching id")
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

const Consultation_Button = () => {
  const [isConsultationActive, setIsConsultationActive] = useState(false);



  const toggleConsultation = async() => {

    
  
    const set_online_status_body = {

      'doctorID' : doc_id,
      'online_status': !isConsultationActive      
    }
    console.log("bef await isconsulatationactive", !isConsultationActive)

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
      setIsConsultationActive(!isConsultationActive)
    })
    .catch(error => {
      console.log(error)
    });
    



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
        <button className="nav-button">Logout</button>
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
