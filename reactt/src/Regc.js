

import React, { useState } from "react";

import './Regc.css'


function Regc() {
  const [firstName, setFirstName] = useState("");
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
    setgender(e.target.value);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit the registration form to the server
  };

  return (
    <div className="container">
      <h1>Online Medical Consultation</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={handleFirstNameChange} />

        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={handleLastNameChange} />



        <label>Age:</label>
        <input type="number" value={Age} onChange={handleAgeChange} />

        <label id="gen">Gender:</label>
        <select name="Choose Gender" id="gender_dropdown" value="Select" onChange={handlegender}>
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


 
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Regc;
