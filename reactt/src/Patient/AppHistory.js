import './styles/appoin_hist.css'
import def_pp from '../imgs/profile.png'


import React, { useState, useEffect } from 'react';

import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';

function AppoinHist() {

  const nav = useNavigate()


  const[searchParams] = useSearchParams();
  const [prof_name, setprofname] = useState('')
  const[appoinlist, settappoinlist] = useState([])

  useEffect(() => {
    console.log(searchParams.get('pat_id'))
    get_prof_name_by_id()
    get_appoin_history()
    
    console.log("Received pat_id: ", searchParams.get("pat_id"));
    console.log("Received profilename pat_id: ", prof_name);

  }, [])

  const get_appoin_history = async() =>{

    const getappoinhist = {patId: searchParams.get("pat_id")}
    await fetch('http://localhost:8090/api/v1/appointment/get_patient_appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getappoinhist)
  
    })
    .then(response => response.json())
    .then(data => {
      console.log("Online apoin list get profff: ",data)
      settappoinlist(data)  
     // console.log("After set profname ",prof_name)     
    })
    .catch(error => {
      console.log(error)
    });




  }

  const get_prof_name_by_id = async() => {

    const getpatidbody = {pat_id: searchParams.get("pat_id")}
    await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getpatidbody)
  
    })
    .then(response => response.json())
    .then(data => {
      console.log("Online docs list get profff: ",data)
      setprofname(data.name)  
      console.log("After set profname ",prof_name)     
    })
    .catch(error => {
      console.log(error)
    });
  
  }
  



    const doctors = [
        {
          id: 1,
          name: "Dr. John Smith",
          photo: "https://via.placeholder.com/200",
          startTime: "9:00 AM",
          endTime: "10:00 AM"
        },
        {
          id: 2,
          name: "Dr. Jane Doe",
          photo: "https://via.placeholder.com/200",
          startTime: "11:00 AM",
          endTime: "12:00 PM"
        }
      ];

      const navToHome = () =>{
        nav({
          pathname: '/home_pat',
          search: createSearchParams({
            pat_id: searchParams.get('pat_id')
          }).toString()
        });
      }
    
      const navToMngProfile = () =>{
        nav({
          pathname: '/patlist',
          search: createSearchParams({
            pat_id: searchParams.get('pat_id')
          }).toString()
        });
      }
    
      const navToAppHis = () =>{
        nav({
          pathname: '/appoinhist',
          search: createSearchParams({
            pat_id: searchParams.get('pat_id')
          }).toString()
        });
      }
    
    
      return (
        <div>
      <div className="navbar">
        <div>
          <button onClick={navToHome} className="nav-button">Home</button>
          <button onClick={navToMngProfile} className="nav-button">Manage Profile</button>
          <button onClick={navToAppHis} className="nav-button">Appointment History</button>

            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button1"><img  />{prof_name}</button>

          <button className="nav-button" >Logout</button>
        </div>
      </div>
          <div className="appointment-history">
          <h1>Appointment History</h1>
            <ul className="doctor-list">
              {appoinlist.map(appointment => (
                <li key={appointment.appointment.appointmentId}>
                  <div className="doctor-profile">
                    <img className="doctor-photo" src={def_pp} alt="Doctor" />
                    <div className="doctor-info">
                      <p className="doctor-name">{appointment.name}</p>
                      <div className="doctor-spec"><b>{appointment.specialization}</b></div>
                      <div className="info-label"><b>Call Start Time:</b> {appointment.appointment.startTime}</div>
                      {/* <div className="info-value">{doctor.startTime}</div> */}
                      <div className="info-label"><b>Call End Time:</b> {appointment.appointment.endTime}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      <div className="info-label"><b>Status: </b>{appointment.appointment.status}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      
                      <button>View Details</button>
                    </div>
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
}

export default AppoinHist;
