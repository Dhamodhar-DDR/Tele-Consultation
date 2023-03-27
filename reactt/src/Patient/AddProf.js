

import React, { useState, useEffect } from "react";
// import { useSearchParams, createSearchParams, useNavigate } from "react-router-dom";

import './AddProf.css'


function AddProf() {

  

  const [Name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setgender] = useState("");
  const [Age, setAge] = useState("");
  

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

  
  const handleSubmit = () =>{};



  return (
    <div>
      <div className="navbar">
        <div>
          <button className="nav-button">Home</button>
          <button className="nav-button">Manage Profile</button>
          <button className="nav-button">Appointment History</button>

            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
        <div>
          <button className="nav-button" >Logout</button>
        </div>
      </div>


    <div className="container">
      <h1>Add Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={Name} onChange={handleFirstNameChange} />


        <label>Age:</label>
        <input type="number" value={Age} onChange={handleAgeChange} />

        <label id="gen">Gender:</label>
        <select id="gender_dropdown" onChange={handlegender}>
            <option value="male">Male</option>
            <option value="female">Female</option>
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
