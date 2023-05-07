

import React, { useState, useEffect } from "react";
import { useSearchParams, createSearchParams, useNavigate } from "react-router-dom";

import './styles/Regc.css'


function Regc() {

  const nav = useNavigate();
  



    useEffect(() => {
        console.log("Received num: from sessst", localStorage.getItem("p_mobile"));
      });
  const[searchParams] = useSearchParams();

  const [Name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setgender] = useState("male");
  const [Age, setAge] = useState("");
  const [data, setData] = useState("");
  const [dob, setDOB] = useState('');


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

  function getCurrentAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("In handle num:",localStorage.getItem("p_mobile"));
    const create_patient_body = {
        'name' : Name,
        'dob' : dob,
        'mobile' : localStorage.getItem("p_mobile"),
        'gender' : gender,
        'email' : email,
        'consent' : false
      }
      localStorage.getItem('jwtToken', data);
      await fetch('http://localhost:8090/api/v1/patient/create', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(create_patient_body)
      })
      .then(response => {
        if (response['status'] == 401)
        {
          nav({
            pathname: '/login_p'
          });
        }
        return response.text();
      })
      .then(data => {
        console.log(data)
        nav('/selectprofile');
        // nav({
        //   pathname: '/selectprofile',
        //   search: createSearchParams({
        //     mobile: localStorage.getItem("p_mobile")
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
    console.log("Age is " , getCurrentAge(dob));
    
  }



  return (

    <div style={{height:"100vh"}}>
    <button className="login-go-back-btn" onClick={()=>nav('/login_p')} >Go back</button>
    <div className="login-center">
        <h1>Patient Register</h1>
        <form  method="post" onSubmit={handleSubmit}>
          <div className="txt_field">
               <input type="text" value={Name} onChange={handleFirstNameChange} required/>
               <span></span>

               <label>Name</label>
          </div>

          <div className="txt_field">
          <span style = {{opacity:"0.5"}}> Enter Date of Birth: </span>
          <label htmlFor="dob"></label>
                <input
                  type="date"
                   id="dob"
                  name="dob"
                  value={dob}
                 onChange={handleDOBChange}
                />
                


          </div>

          {/* <div className="txt_field">
          <input type="number" value={Age} onChange={handleAgeChange} required/>
          <span></span>
 
              <label>Age:</label>
          </div> */}

<span style = {{opacity:"0.5"}}> Select Gender: </span>
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
