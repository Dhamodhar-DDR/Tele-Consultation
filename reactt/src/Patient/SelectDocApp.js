import React from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import './styles/select_doc.css'
import def_pp from '../imgs/profile.png'
import Modal from "./UploadRecords"

import { useState, useEffect } from "react";

function DoctorList() {

  const nav = useNavigate()
  const [doclist, setdoclist] = useState([])
  const[searchParams] = useSearchParams();
  const [prof_name, setprofname] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState('sd');

  const[send_did, setdid] = useState(-1)



  const toggleModal = (param, did) => {
    return (()=>{
      if(param!="close") 
      {
        setUploadType(param)
        setdid(did)
      }
      setShowModal(!showModal);
    })
  };

  function handleBookAppointment (doc_id) {
    return async function() {
      const now = new Date(); // get current date and time
      const timestamp = now.toISOString(); // convert to ISO string
      console.log(timestamp); // prints something like "2023-03-18T14:25:48.123Z"
  
      const create_app_body = {
        bookingTime : timestamp,
        patientId : localStorage.getItem('p_pat_id'),
        doctorId: doc_id,
        startTime : null,
        endTime : null,
        isFollowup: false,
        markForFollowup : false,
        FollowupReason: '',
        status : 'waiting',
        description : ''
      }
      await fetch('http://localhost:8090/api/v1/appointment/create_appointment', {
        method: 'POST',
        headers: {
        'Authorization': localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(create_app_body)
      })
      .then(response => {
        if (response['status'] == 401)
        {
          // nav({
          //   pathname: '/login_p'
          // });
          handleLogout();
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        console.log(data.appointmentId)
        nav('/waiting_page');
        // nav({
        //   pathname: '/waiting_page',
        //   search: createSearchParams({
        //     doc_id: doc_id,
        //     pat_id: searchParams.get("pat_id"),
        //     app_id: data.appointmentId
        //   }).toString()
        // });
      })
      .catch(error => {
        console.log(error)
      });
    }
  }

  const DoctorProfile = (props) => {
    return (
      <div className="doctor-profile">
        <div className="doctor-details">
          <img src={props.image} alt={props.name} />
          <div className="doctor-text">
            <h2>Dr. {props.name}</h2>
            <p>{props.experience} years of experience</p>
            <p>{props.description}</p>
          </div>
        </div>
        <div className="book-appointment">
          {/* <button onClick={handleBookAppointment(props.id)}>Book Appointment</button> */}
          <button onClick={toggleModal('sd',props.id)}>Book Appointment</button>
          
        </div>
      </div>
    );
}

const get_prof_name_by_id = async() => {

  const getpatidbody = {pat_id: localStorage.getItem('p_pat_id')}
  await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
    body: JSON.stringify(getpatidbody)

  })
  .then(response => {
    if (response['status'] == 401)
    {
      // nav({
      //   pathname: '/login_p'
      // });
      handleLogout();
    }
    return response.json();
  })
  .then(data => {
    console.log("Online docs list get profff: ",data)
    setprofname(data.name)  
    console.log("After set profname ",prof_name)     
  })
  .catch(error => {
    console.log(error)
  });

}


  const get_onine_doc_list = async() => {
    await fetch('http://localhost:8090/api/v1/doctor/get_online_doctors', {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('jwtToken'),

        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
  
    })
    .then(response => {
      if (response['status'] == 401)
      {
        // nav({
        //   pathname: '/login_p'
        // });
        handleLogout();
      }
      return response.json();
    })
    .then(data => {
      console.log("Online docs list: ",data)
      setdoclist(data)      
    })
    .catch(error => {
      console.log(error)
    });

  }

  const handleLogout = () =>{
    if(localStorage.getItem('p_pat_id') != null) localStorage.removeItem('p_pat_id');
    if(localStorage.getItem('p_mobile') != null) localStorage.removeItem('p_mobile');
    if(localStorage.getItem('p_doc_id') != null) localStorage.removeItem('p_doc_id');
    if(localStorage.getItem('p_app_id') != null) localStorage.removeItem('p_app_id'); 
    if(localStorage.getItem('p_upload') != null) localStorage.removeItem('p_upload');
    if(localStorage.getItem('p_type') != null) localStorage.removeItem('p_type'); 
    localStorage.removeItem('jwtToken');
    nav('/login_p')
    window.location.reload();
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

    nav('/patlist');
    // nav({
    //   pathname: '/patlist',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }

  const navToAppHis = () =>{
    nav('/appoinhist')
  }



  useEffect(() => {


    get_prof_name_by_id()
    get_onine_doc_list()
    console.log("Received pat_id from sess: ", localStorage.getItem('p_pat_id'));
    console.log("Received profilename pat_id: ", prof_name);
  }, [])

  return (
    <div>
      {/* Navigation bar */}
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
          <button className="nav-button" onClick={handleLogout}>Logout</button>
          
        </div>
      </div>
      <h1 className="heading-1">Choose a doctor</h1>
      <div style = {{marginLeft:"160px"}}>
      <div className="doctor-list">
        <br/>
        
          
          {doclist.map((doctor) => (
            <DoctorProfile
              key={doctor.doctorId}
              image={def_pp}
              name={doctor.name}
              id = {doctor.doctorId}
              experience={doctor.experience}
              description={doctor.specialization}
            />
        ))}

      </div>

      {showModal && (<Modal toggle={toggleModal} upload_type={'from_sd'} pat_id={localStorage.getItem('p_pat_id')} app_id={-1} doctor_id={send_did}/>)}
      
    </div>
    </div>
    
  );
}

export default DoctorList;
