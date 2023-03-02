import React from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';


import './select_doc.css'
import def_pp from '../src/imgs/profile.png'

import { useState, useEffect } from "react";

//import DoctorProfile from "./DoctorProfile";

function DoctorProfile(props) {
    // return (
    //   <div className="doctor-profile">
    //     <img src={props.image} alt={props.name} />
    //     <h2>{props.name}</h2> <br/>
    //     <p>{props.experience} years of experience</p> <br/>
    //     <p>{props.description}</p> <br/>
    //     <button>Book Appointment</button>
    //   </div>
    // );
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



  



  // const p1 = {id: 1, image: "D:/tele-git/Tele-Consultation/reactt/src/imgs/download.jpeg",name:"Veer", experience: 21, description:"asdasfa"}
  // const p2 = {id: 2, image: "./imgs/p2.jpeg",name:"Rocky", experience: 47, description:"asfgsdgs"}
  // const p3 = {id: 3, image: "./imgs/p3.jpeg",name:"Ethan", experience: 23, description:"abxcbxcxbc"}
  // const p4 = {id: 4, image: "./imgs/p1.jpeg",name:"D3", experience: 11, description:"asdasfa"}
  // const p5 = {id: 5, image: "./imgs/p2.jpeg",name:"Bala", experience: 17, description:"asfgsdgs"}
  // const p6 = {id: 6, image: "./imgs/p3.jpeg",name:"Bachan", experience: 1, description:"abxcbxcxbc"}
  // const p7 = {id: 4, image: "./imgs/p1.jpeg",name:"Kolli", experience: 2, description:"asdasfa"}
  // const p8 = {id: 5, image: "./imgs/p2.jpeg",name:"Chris", experience: 7, description:"asfgsdgs"}
  // const p9 = {id: 6, image: "./imgs/p3.jpeg",name:"Eth", experience: 22, description:"abxcbxcxbc"}

  const nav = useNavigate()

  const HandleLogout = () =>{
  
    nav('/login_p')
  
    
  }
  


 
  //const doctors = [p1,p2,p3,p4,p5,p6,p7,p8];
 
  return (

    <>
      
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
        <button className="nav-button" onClick={HandleLogout}>Logout</button>
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

    </>
  );
}

export default DoctorList;
