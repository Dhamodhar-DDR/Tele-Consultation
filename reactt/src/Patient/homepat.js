import './homepat.css'

import React, { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';



function Homepat(){

  const [showModal, setShowModal] = useState(false);

  const[searchParams] = useSearchParams();

  const nav = useNavigate();

  const pat_id = searchParams.get("pat_id");

  const [prof_name, setprofname] = useState('')

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
  

  useEffect(() => {


    get_prof_name_by_id()
    
    console.log("Received pat_id: ", searchParams.get("pat_id"));
    console.log("Received profilename pat_id: ", prof_name);
  }, [])


  const handleAutoassign = () => {

    nav({
      pathname: '/modal',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });



  }

  const handleSelectDoc = () => {

    nav({
      pathname: '/select_doc',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }

  const handleManageProf = () => {
    nav({
      pathname: '/patlist',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }
  const handleAppoinHist = () => {
    nav({
      pathname: '/appoinhist',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }


  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleLogout = () =>{
    nav('/login_p')
  }
  
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
    // nav('/login_p')
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
        <button className="nav-button1"><img />{prof_name}</button>
          <button className="nav-button" onClick={handleLogout}>Logout</button>
          
        </div>
      </div>




      <div className="button-container">
      <div className="button dropdown">
        New Appointment
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={handleSelectDoc}>Choose a doctor</button>
          <button className="dropdown-item" onClick={handleAutoassign}>Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button dropdown">
        Follow Up Appointment
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={handleAutoassign}>Assign Previous Doctor</button>

          <button className="dropdown-item" onClick={handleAutoassign}>Auto-assign a doctor</button>

        </div>
      </div>
      <div className="button" onClick={handleManageProf}>Manage Profiles</div>
      <div className="button" onClick={handleAppoinHist}>Appointment History</div>
    </div>

    </div>

        




      );
      
    


    }

export default Homepat;