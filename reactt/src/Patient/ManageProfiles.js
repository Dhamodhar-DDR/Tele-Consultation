import React from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import './styles/manageprof.css'
import def_pp from '../imgs/profile.png'

import { useState, useEffect } from "react";

function PatList() {

  const [prof_name, setprofname] = useState('')
  const [searchParams] = useSearchParams();
  

  const get_prof_name_by_id = async() => {

    const getpatidbody = {pat_id: sessionStorage.getItem('pat_id')}
    await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken"),
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
  

  // useEffect(() => {


    // get_prof_name_by_id()
    
    // console.log("Received pat_id: ", searchParams.get("pat_id"));
    // console.log("Received profilename pat_id: ", prof_name);
  // }, [])

  const [doclist, setdoclist] = useState([])
  // const p1 = {name: "pat1", gender: "Male", age: 21, email: "abc@abc"}
  // const p2 = {name: "pat2", gender: "Female", age: 28, email: "ac@abc"}

  const nav = useNavigate();
  
  const pat_id = sessionStorage.getItem('pat_id');
  console.log("loook ", pat_id)
  const get_all_profiles = async() => {
    const getProfilesBody = {
      pat_id : sessionStorage.getItem('pat_id')
    }
    await fetch('http://localhost:8090/api/v1/patient/get_all_profiles', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*' ,
        'Authorization': localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getProfilesBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Profiles List: ",data)
      setdoclist(data);
    })    
  }

  useEffect(() => {
    console.log("received id sess: ",sessionStorage.getItem('pat_id'))
    get_prof_name_by_id()
    
    console.log("Received pat_id: ", sessionStorage.getItem('pat_id'));
    console.log("Received profilename pat_id: ", prof_name);

    get_all_profiles();
  }, [])

  const handleAppoinHist = () => {

    nav('/appoin_hist');
    // nav({
    //   pathname: '/appoinhist',
    //   search: createSearchParams({
    //     pat_id: searchParams.get("pat_id")
    //   }).toString()
    // });

  }

  const handleAddProf = () =>{

    nav('/addprof');
    // nav({
    //   pathname: '/addprof',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });
  }

  const handleSwitchProf = () => {

    nav('/selectprofile')
    // nav({
    //   pathname: '/selectprofile',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });
  }

  const navToHome = () =>{

    nav('/home_pat')
    // nav({
    //   pathname: '/home_pat',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }

  const navToMngProfile = () =>{

    nav('/patlist')
    // nav({
    //   pathname: '/patlist',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }


  const DoctorProfile = (props) => {
    return (
      <div className="doctor-profile">
        <div className="doctor-details">
          <img src={props.image} alt={props.name} />
          <div className="doctor-text">
            <h2>{props.name}</h2>
            <p>{props.gender} </p>
            <p>{props.age}</p>
            <p>{props.email}</p>
          </div>
        </div>
        <div className="book-appointment">
          <button>Edit Profile</button>
        </div>
      </div>
    );
}

//   const get_onine_doc_list = async() => {
//     await fetch('http://localhost:8090/api/v1/doctor/get_online_doctors', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*' 
//       },
  
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log("Online docs list: ",data)
//       setdoclist(data)      
//     })
//     .catch(error => {
//       console.log(error)
//     });

//   }

//   const handleLogout = () =>{
//     nav('/login_p')
//   }

//   useEffect(() => {
//     get_onine_doc_list()
//     console.log("Received pat_id: ", searchParams.get("pat_id"));
//   }, [])

  return (
    <div>
      {/* Navigation bar */}
      <div className="navbar">
        <div>
          <button onClick={navToHome} className="nav-button">Home</button>
          <button onClick={navToMngProfile} className="nav-button">Manage Profile</button>
          <button onClick={handleAppoinHist} className="nav-button">Appointment History</button>

            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button1"><img  />{prof_name}</button>

          <button className="nav-button" >Logout</button>
        </div>
      </div>
      <h1 className="heading-1">List of Profiles</h1>
      <div className="doctor-list">
        {console.log("doclist: ", doclist)}
        <br/>
        
          {doclist.map((doctor, index) => (
            <DoctorProfile
              key = {index}
              image={def_pp}
              name={doctor.name}
              gender = {doctor.gender}
              age={doctor.age}
              email={doctor.email}
            />
        ))}
      </div>
      <div className="end-buttons">
           <button onClick={handleAddProf}>Add Profile</button> <br/>
           <button onClick={handleSwitchProf}>Switch Profile</button>
      </div>
    </div>
  );
}

export default PatList;
