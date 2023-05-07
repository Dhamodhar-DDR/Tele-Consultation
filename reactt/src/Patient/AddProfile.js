

import React, { useState, useEffect } from "react";
import { useSearchParams, createSearchParams, useNavigate } from "react-router-dom";

import './styles/AddProf.css'


function AddProf() {

  
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [dob, setDOB] = useState('');

  const [Name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setgender] = useState("");
  const [Age, setAge] = useState("");

  const [prof_name, setprofname] = useState('')

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

  const get_prof_name_by_id = async() => {

    const getpatidbody = {pat_id: localStorage.getItem('p_pat_id')}
    await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getpatidbody)
  
    })
    .then(response =>{
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

  

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAgeChange = (e) => {
    if(e.target.value > 99)
    {

    }
    setAge(e.target.value);
  };

  const handlegender= (e) => {
    console.log(e.target.value);
    setgender(e.target.value);
  };


  useEffect(() => {
    console.log("received id to add prof frm sess, ",localStorage.getItem('p_pat_id'));
    
    get_prof_name_by_id()
    
    console.log("Received pat_id: ", localStorage.getItem('p_pat_id'));
    console.log("Received profilename pat_id: ", prof_name);

  }, [])
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    const create_patient_body = {
      'pat_id': localStorage.getItem('p_pat_id'),
      'name' : Name,
      'dob' : dob,
      'gender' : gender,
      'email' : email,
      'consent' : false
    }
    await fetch('http://localhost:8090/api/v1/patient/add_new_profile', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(create_patient_body)
    })
    .then(response => {
      if (response['status'] == 401)
        {
          // nav({
          //   pathname: '/login_p'
          // });
          handleLogout();
        }
      // console.log(response)
      return response;
    })
    .then(data => {
      console.log(data)
      // localStorage.setItem('p_pat_id', data.patientId);
      nav('/selectprofile');
      // nav({
      //   pathname: '/selectprofile',
      //   search: createSearchParams({
      //     pat_id: data.patientId
      //   }).toString()
      // });
    })
    .catch(error => {
      console.log(error)
    });

  };


  const handleDOBChange = (event) => {
    setDOB(event.target.value);
    console.log(event.target.value)

    const [year, month, day] = dob.split('-').map(Number);

    console.log(year); // Output: 2023
    console.log(month); // Output: 5
    console.log(day); // Output: 8    
    
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


  return (
    <div>
      <div className="navbar">
        <div>
          <button onClick={navToHome} className="nav-button">Home</button>
          <button onClick={navToMngProfile} className="nav-button">Manage Profile</button>
          <button className="nav-button">Appointment History</button>
            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button1"><img  />{prof_name}</button>
          <button className="nav-button" >Logout</button>
        </div>
      </div>


    <div className="addprof-container">
      <h1>Add Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input required type="text" value={Name} onChange={handleFirstNameChange} />


        {/* <div className="txt_field"> */}
          <span style = {{opacity:"0.5"}}> Enter Date of Birth: </span>
          <label htmlFor="dob"></label>
                <input
                  type="date"
                   id="dob"
                  name="dob"
                  value={dob}
                 onChange={handleDOBChange}
                />
                


          {/* </div> */}



        {/* <label>Age:</label>
        <input required type="number" value={Age} onChange={handleAgeChange} /> */}

        {/* <label htmlFor="dob"></label>
                <input
                  type="date"
                   id="dob"
                  name="dob"
                  value={dob}
                 onChange={handleDOBChange}
                /> */}


        <label id="gen">Gender:</label>
        <select id="gender_dropdown" onChange={handlegender}>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="others">Others</option>
            <option value="Prefer not to say">Prefer not to say</option>
        </select><br/>
        {/* <input type="radio" value="Male" id="male" onChange={handleAgeChange} />
        <label for="male">Male</label>
        <input type="radio" value="Female" id="male" onChange={handleAgeChange} />
        <label for="female">Female</label> */}
        <label>Email:</label>
        <input type="email" value={email} placeholder="(optional)" onChange={handleEmailChange} />
        <button className="Login-doc-button" type="submit">Add Profile</button>
      </form>
    </div>

    </div>
  );
}

export default AddProf;
