import './styles/homepat.css'

import React, { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import Modal from "./UploadRecords"

function catchError( error ){

  console.log( error );

}
function Homepat(){

  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState('');

  const toggleModal = (param) => {
    return (()=>{
      console.log("Close called!")
      if(param!="close") setUploadType(param)
      setShowModal(!showModal);
    })
  };


  const[searchParams] = useSearchParams();

  const nav = useNavigate();

  // const pat_id = searchParams.get("pat_id");

  const pat_id = sessionStorage.getItem('pat_id');

  const [prof_name, setprofname] = useState('')

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
    .then(response =>  response.json()
//       if( !response.ok ){
// console.log("yep");
// nav({
//   pathname: '/login_p',
  // search: createSearchParams({
  //   mobile: phone
  // }).toString()
// });
// alert("Please login again")
//         catchError( response );}
//         else
//         response.json();
    )
    .then(data => {
      console.log("Online docs list get profff: ",data)
      setprofname(data.name)  
      console.log("After set profname ",prof_name)     
    })
    .catch(error => {
      // console.log(error)
    });
  }
  

  useEffect(() => {
    get_prof_name_by_id()
    
    console.log("Received pat_id from sess: ", sessionStorage.getItem('pat_id'));
    console.log("Received profilename pat_id: ", prof_name);
  }, [])


  const handleUploadRecords = () => {

    sessionStorage.setItem('upload_t', 0);
    
    nav('/upload_records');

  //   nav({
  //     pathname: '/upload_records',
  //   //   search: createSearchParams({
  //   //     upload_t: 0,
  //   //     pat_id: pat_id
  //   //   }).toString()
  //   // });
   }

  const handleViewRecords = () => {

    nav('/view_records');
    // nav({
    //   pathname: '/view_records',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });
  }

  const handleSelectDoc = () => {

    nav('/select_doc');

    // nav({
    //   pathname: '/select_doc',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });

  }

  const handleManageProf = () => {

    nav('/patlist');

    // nav({
    //   pathname: '/patlist',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });

  }
  const handleAppoinHist = () => {

    nav('/appoinhist')


    // nav({
    //   pathname: '/appoinhist',
    //   search: createSearchParams({
    //     pat_id: pat_id
    //   }).toString()
    // });

  }


  const handleLogout = () =>{
    console.log("welluntil")
    sessionStorage.clear();
    localStorage.removeItem('jwtToken');
    console.log("welluntil")
    nav('/login_p');
  }
  
  const navToHome = () =>{

    nav('/home_pat');

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
    // nav('/login_p')
  }

  const goToSummary = ()=>{

    // sessionStorage.setItem()
    nav({
      pathname: '/call_summary',
      search: createSearchParams({
        pat_id: 1,
        doc_id: 1,
        app_id: 5
      }).toString()
    });
  }

    return (

      <div>
      <div className="navbar">
        <div>
          <button onClick={navToHome} className="nav-button">Home</button>
          <button onClick={navToMngProfile} className="nav-button">Manage Profile</button>
          <button onClick={handleAppoinHist} className="nav-button">Appointment History</button>
          
          

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
          <button className="dropdown-item" onClick={toggleModal("upload-auto")}>Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button dropdown">
        Follow Up Appointment
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={toggleModal("upload-follow-prev")}>Assign Previous Doctor</button>
          <button className="dropdown-item" onClick={toggleModal("upload-follow-auto")}>Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button dropdown">
        Health Records
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={toggleModal("upload-normal")}>Upload health records</button>
          <button className="dropdown-item" onClick={handleViewRecords}>View health records</button>
        </div>
      </div>  
      {/* <button onClick={goToSummary}> SUmmary Page</button> */}
      <div className="button" onClick={handleAppoinHist}>Appointment History</div>
    </div>
          {showModal && (<Modal toggle={toggleModal} upload_type={uploadType} pat_id={searchParams.get("pat_id")} app_id={-1}/>)}
    </div>
    );
  }


export default Homepat;