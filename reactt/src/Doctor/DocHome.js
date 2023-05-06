import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import './styles/DocHome.css'
import def_pp from '../imgs/profile.png'

import jwt from 'jwt-decode';


function DocHome() {
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const [doc_id, setDoc_id] = useState(-1);
  const[appoinlist, settappoinlist] = useState([])
  const [patient,setPatient] = useState({name : 'loading...', age : 'loading...', gender : 'loading...', mobile: 'loading...', email: 'loading...'})
  const [showPopup, setShowPopup] = useState(false);
  const[searchParams] = useSearchParams();
  const nav = useNavigate()
  const did = localStorage.getItem('doc_id')
  let help;
  useEffect(() => {
    console.log(localStorage.getItem('doc_id'));
    get_doc_id();
    get_appoin_history()    
  }, [])

  const get_doc_id = async() => {
    const get_doc_by_mobile_body = {
      'mobile_number': jwt(localStorage.getItem('jwtToken_doc'))['sub']
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
    .then(response =>{
      console.log(response);
      if (response['status'] == 401)
      {
        localStorage.removeItem('jwtToken_doc')
        nav({
          pathname: '/login_doc'
        });
      }
      return response.json()
    })
    .then(data => {
      console.log("Doc Id assigned: ",data.doctorId)
      localStorage.setItem('doc_id',data.doctorId)
      nav('/DocHome')
      // nav({
      //   pathname: '/DocHome',
      //   search: createSearchParams({
      //     doc_id: data.doctorId
      //   }).toString()
      // });
    })
    .catch(error => {
      console.log("error fetching id")
      console.log(error)
    });
  }
  const get_appoin_history = async() =>{

    const getappoinhist = {docId: localStorage.getItem('doc_id')}
    await fetch('http://localhost:8090/api/v1/appointment/get_doctor_followup_appointments', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken_doc"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getappoinhist)
  
    })
    .then(response => {
      console.log(response);
      if (response['status'] == 401)
      {
        localStorage.removeItem('jwtToken_doc')
        nav({
          pathname: '/login_doc'
        });
      }
      return response.json()
    })
    .then(data => {
      console.log("Online docs apoin list get profff: ",data)
      settappoinlist(data.reverse())  
     // console.log("After set profname ",prof_name)     
    })
    .catch(error => {
      console.log(error)
    });
  }


  const get_online_stat = async(doc_id_param) => {
    console.log("doc_id_param: ", doc_id_param)
    const check_status_body = {
      'doctorID': doc_id_param
    }
    await fetch('http://localhost:8090/api/v1/doctor/check_online_status', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken_doc"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(check_status_body)
    })
    .then(response => {
      console.log(response);
      if (response['status'] == 401)
      {
        console.log("ASDSADSDDSAD")
        if (localStorage.getItem('jwtToken_doc'))
        {
        localStorage.removeItem('jwtToken_doc')
        }
        nav({
          pathname: '/login_doc'
        });
      }
      return response.json()
    })
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

  const handleAppointHist = () =>{

    localStorage.setItem('doc_id',did);
    nav('/DocAppoinHist');
    // nav({
    //   pathname: '/DocAppoinHist',
    //   search: createSearchParams({
    //     doc_id: did
    //   }).toString()
    // });
  }

  const HandleLogout = async() =>{
    await set_status(false)
    localStorage.clear();
    localStorage.removeItem('jwtToken_doc');
    nav('/login_doc');
    window.location.reload();
  }

  const set_status = async(param) =>
  {
   console.log(doc_id); 
    const set_online_status_body = {

      'doctorID' : localStorage.getItem("doc_id"),
      'online_status': param      
    }
    console.log("bef await isconsulatationactive", param)
    await fetch('http://localhost:8090/api/v1/doctor/set_online_status', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken_doc"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(set_online_status_body)
    })
    .then(response => {
      console.log(response);
      if (response['status'] == 401)
      {
        localStorage.removeItem('jwtToken_doc')
        nav({
          pathname: '/login_doc'
        });
      }
      return response.json()
    })
    .then(data => {
      console.log("Online status: ",data)
      setIsConsultationActive(param)
    })
    .catch(error => {
      console.log(error)
    });
  }

  const Consultation_Button = () => {
    const toggleConsultation = async() => {
      await set_status(!isConsultationActive);
      nav('/doctor_call');
      // nav({
      //   pathname: '/doctor_call',
      //   search: createSearchParams({
      //     doc_id: searchParams.get("doc_id")
      //   }).toString()
      // });
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

  useEffect(() => {
    get_doc_id();
    console.log("Received id sesssto: ", localStorage.getItem('doc_id'));
    setDoc_id(localStorage.getItem('doc_id'));
    get_online_stat(localStorage.getItem('doc_id'));
  }, []);

  const removeFollowUp = async(app,index) => {
    console.log(app)
    const values = [...appoinlist];
    values.splice(index, 1);
    settappoinlist(values);
    
    const set_follow_up_body = {
        appId :  app.appointment.appointmentId,
        mark : false,
        followupReason : app.appointment.followupReason
    }
    await fetch('http://localhost:8090/api/v1/appointment/set_appointment_for_followup', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jwtToken_doc"),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(set_follow_up_body)
    })
    .then(response => {
      console.log(response);
      if (response['status'] == 401)
      {
        localStorage.removeItem('jwtToken_doc')
        nav({
          pathname: '/login_doc'
        });
      }
      return response.json()
    })
    .then(data => {
        console.log("Online status: ",data)
    })
    .catch(error => {
        console.log(error)
    });
  }


  const getPatientDetails = async(pat_id) => {
    setShowPopup(!showPopup);
    await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jwtToken_doc"),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({pat_id: pat_id})
    }).then(async(response)=>{
      const pat = await response.json();
      
        console.log(response);
        if (response['status'] == 401)
        {
          localStorage.removeItem('jwtToken_doc')
          nav({
            pathname: '/login_doc'
          });
        }
        // return response.json()
    
      console.log(pat)
      setPatient({name : pat.name, age : pat.age, gender : pat.gender, mobile: pat.mobileNumber, email: pat.email})
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const convertTime=(curr) =>{
    if(curr!==null)
    {
      const df = new Date(curr);
      const date_str = String(df);
      return <>{date_str.substring(0,date_str.length-31)+" IST"}</>; //prints date in current locale
    }
    else return <></>
  }

  return (
    <div>
      {/* Navigation bar */}
      <div className="navbar">
        <div>
        <button className="nav-button">Home</button>
        <button className="nav-button">Edit Profile</button>
        <button className="nav-button" onClick={handleAppointHist}>Appointment History</button>

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
      <div className="appointment-history">
          <h1>Patients marked for follow up</h1>
          {appoinlist.length == 0? "No follow up reminders":
            <ul className="doctor-list">
              {appoinlist.map((appointment,index) => (
                <li key={appointment.appointment.appointmentId}>
                  <div className="doctor-profile">
                    <img className="doctor-photo" src={def_pp} alt="Doctor" />
                    <div className="doctor-info">
                      
                      <div className="doctor-name">{appointment.name}</div>
                      <div className="info-label"><b>Call Start Time:</b> {convertTime(appointment.appointment.startTime)}</div>
                      {/* <div className="info-value">{doctor.startTime}</div> */}
                      <div className="info-label"><b>Call End Time:</b> {convertTime(appointment.appointment.endTime)}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      <div className="info-label"><b>Status: </b>{appointment.appointment.status}</div>
                      <div className="info-label"><b>Reason for Follow Up: </b>{appointment.appointment.followupReason}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      <span>
                        <button onClick={()=>getPatientDetails(appointment.appointment.patientId)} className='followup-apphis-btn'>View Patient Details</button>
                        {showPopup && (
                          <div className="foll-pat-details-popup">
                            <div className="foll-pat-details-popup-content">
                              <h2>Patient details</h2>
                              <img className="doctor-photo" src={def_pp} alt="Doctor" />
                              <div className="info-label"><b>Name: </b>{patient.name}</div>
                              <div className="info-label"><b>Gender: </b>{patient.gender}</div>
                              <div className="info-label"><b>Age: </b>{patient.age}</div>
                              <div className="info-label"><b>Mobile number: </b>{patient.mobile}</div>
                              <div className="info-label"><b>Email ID: </b>{patient.email}</div>
                              <button className="foll-pat-details-close-popup-btn" onClick={()=>setShowPopup(!showPopup)} >
                                X
                              </button>
                            </div>
                          </div>
                        )}
                        <button onClick={()=>removeFollowUp(appointment,index)} className='followup-apphis-close-btn'>X</button>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      
    </div>
  );
}

export default DocHome;
