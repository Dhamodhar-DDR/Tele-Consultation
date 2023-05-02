

import React, { useState, useEffect } from "react";
import { useSearchParams, createSearchParams, useNavigate } from "react-router-dom";

import './styles/Regc.css'


function Regc() {

  const nav = useNavigate();
  



    useEffect(() => {
        console.log("Received num: ", searchParams.get("mobile"));
      });
  const[searchParams] = useSearchParams();

  const [Name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setgender] = useState("male");
  const [Age, setAge] = useState("");
  const [data, setData] = useState("");

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

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("In handle num:",searchParams.get("mobile"));
    const create_patient_body = {
        'name' : Name,
        'age' : Age,
        'mobile' : searchParams.get("mobile"),
        'gender' : gender,
        'email' : email,
        'consent' : false
      }
      localStorage.getItem('jwt token', data);
      await fetch('http://localhost:8090/api/v1/patient/create', {
        method: 'POST',
        headers: {
          'Authorization': data,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(create_patient_body)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        nav({
          pathname: '/selectprofile',
          search: createSearchParams({
            mobile: searchParams.get("mobile")
          }).toString()
        });
      })
      .catch(error => {
        console.log(error)
      });

  };



  return (

    <div>
    <button className="login-go-back-btn" >Go back</button>
    <div className="login-center">
        <h1>Patient Register</h1>
        <form  method="post">



          <div className="txt_field">
 
               
               
               <input type="text" value={Name} onChange={handleFirstNameChange} required/>
               <span></span>

               <label>Name</label>
          </div>

          <div className="txt_field">
          <input type="number" value={Age} onChange={handleAgeChange} required/>
          <span></span>
 
              <label>Age:</label>
          </div>

          
          <select class="custom-select" onChange={handlegender}>
            <option disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
          <option value="Prefer not to say">Prefer not to say</option>
          </select>

          
          {/* <label id="gen">Gender:</label> */}
        
  

          
           
           {/* <select id="gender_dropdown" onChange={handlegender} required>
              <option value="male">Male</option>
                <option value="female">Female</option>
              <option value="others">Others</option>
            <option value="Prefer not to say">Prefer not to say</option>
           </select> */}

          

           

 
        

          <div className="txt_field">

          
          <input type="email(optional)" value={email}  onChange={handleEmailChange} required/>
          <span></span>
          <label>Email:</label>


           </div>





  {/* <input type="radio" value="Male" id="male" onChange={handleAgeChange} />
  <label for="male">Male</label>
  <input type="radio" value="Female" id="male" onChange={handleAgeChange} />
  <label for="female">Female</label> */}



  <button className="login-otp-button" type="submit">Register</button>


         </form>
       </div>
   </div>



  );
}

export default Regc;
