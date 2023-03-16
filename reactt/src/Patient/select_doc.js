import React from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import './select_doc.css'
import def_pp from '../imgs/profile.png'

import { useState, useEffect } from "react";

//import DoctorProfile from "./DoctorProfile";

function DoctorProfile(props) {
    return (
        <div className="doctor-profile">
          <div className="doctor-details">
            <img src={props.image} alt={props.name} />
            <div className="doctor-text">
              <h2>{props.name}</h2>
              <p>{props.experience} years of experience</p>
              <p>{props.description}</p>
            </div>
          </div>
          <div className="book-appointment">
            <button>Book Appointment</button>
          </div>
        </div>
      );
  }
  

function DoctorList() {

  const [doclist, setdoclist] = useState([])

  useEffect(() => {

    get_onine_doc_list()

  }, [])

  const get_onine_doc_list = async() => {

    await fetch('http://localhost:8090/api/v1/doctor/get_online_doctors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
  
    })
    .then(response => response.json())
    .then(data => {
      console.log("Online docs list: ",data)
      setdoclist(data)      
    })
    .catch(error => {
      console.log(error)
    });

  }

  const nav = useNavigate()
  
  const handleLogout = () =>{
    nav('/login_p')
  }
 
  return (
    <div>
      {/* Navigation bar */}
      <div className="navbar">
        <div>
        <button className="nav-button">Home</button>
        <button className="nav-button">Manage Profile</button>
        <button className="nav-button">Appointment History</button>

          {/* <a href="#">Edit Profile</a>
          <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="doctor-list">
        <br/>
        <h1 className="heading-1">Choose a doctor</h1>
          {doclist.map((doctor) => (
            <DoctorProfile
              key={doctor.doctorId}
              image={def_pp}
              name={doctor.name}
              experience={doctor.experience}
              description={doctor.specialization}
            />
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
