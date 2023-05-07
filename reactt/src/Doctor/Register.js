import React, { useState, useEffect } from "react";

import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';


import './styles/Reg.css'


function Regdoc() {

  
  const nav = useNavigate();
  
  const[searchParams] = useSearchParams();
  const [dob, setDOB] = useState('');

  const [Name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const[spec, setSpec] = useState("General");
  const[exp, setExp] = useState("");
  const [gender, setgender] = useState("male");
  const [Age, setAge] = useState("");

  useEffect(() => {
    console.log("Received num: ", localStorage.getItem('d_mobile'));
  });

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
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
  const handleexp= (e) => {
    console.log(e.target.value);
    setExp(e.target.value);
  };

  const handlespec= (e) => {
    console.log(e.target.value);
    setSpec(e.target.value);
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("In handle num:",localStorage.getItem('d_mobile'));
    const create_doc_body = {
        'name' : Name,
        'mobile' : localStorage.getItem('d_mobile'),
        'dob' : dob,
        'specialization':spec,
        'experience': exp,
        'email' : email,
        'gender' : gender,
        'onlineStatus' : false
      }
      console.log(create_doc_body);
      console.log(localStorage.getItem('jwtToken_doc'));
      await fetch('http://localhost:8090/api/v1/doctor/add_doctor', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('jwtToken_doc'),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(create_doc_body)
      })
      .then(response => {
        if (response['status'] == 401)
        {
          nav({
            pathname: '/login_doc'
          });
        }
        return response.text();
      }
      
      )
      .then(async(data) => {
        const get_doc_by_mobile_body = {
          'mobile_number': localStorage.getItem('d_mobile')
        }
        await fetch('http://localhost:8090/api/v1/doctor/get_doctor_by_mobile', {
          method: 'POST',
          headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),

            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
          body: JSON.stringify(get_doc_by_mobile_body)
        })
        .then(response => {
          if (response['status'] == 401)
          {
            nav({
              pathname: '/login_doc'
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("Doc Id assigned: ",data.doctorId)
          localStorage.setItem('d_doc_id', data.doctorId);
          
          if(localStorage.getItem('d_mobile') != null) localStorage.removeItem('d_mobile');
          nav('/DocHome')
          // nav({
          //   pathname: '/DocHome',
          //   search: createSearchParams({
          //     doc_id: data.doctorId
          //   }).toString()
          // });
        })
        .catch(error => {
          console.log("error fetching id")
          console.log(error)
        });
        
        // nav({
        //   pathname: '/DocHome',
        //   search: createSearchParams({
        //     doc_id: doc_id
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




  return (

    <div style={{height:"100vh"}}>
    <button className="login-go-back-btn" onClick={()=>nav('/login_doc')}>Go back</button>
    <div className="login-center">
        <h1>Doctor Register</h1>
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

          <select class="custom-select" onChange={handlegender}>
            <option disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
          <option value="Prefer not to say">Prefer not to say</option>
          </select>

          {/* <label id="gen">Gender:</label> */}
          {/* <div className="txt_field">

          
           
           <select id="gender_dropdown" onChange={handlegender} required>
              <option value="male">Male</option>
                <option value="female">Female</option>
              <option value="others">Others</option>
            <option value="Prefer not to say">Prefer not to say</option>
           </select>

          

           

 
          </div> */}

          <div className="txt_field">

          
          <input type="email(optional)" value={email}  onChange={handleEmailChange} required/>
          <span></span>
          <label>Email:</label>


 

          </div>

          <select class="custom-select" onChange={handlespec}>
            <option disabled>Select Specialisation</option>
            <option value="General">General</option>
          <option value="Cardiologist">Cardiologist</option>

          <option value="Pulmonologist">Pulmonologist</option>
          <option value="Dentist">Dentist</option>
          </select>

          <div className="txt_field">

          <input type="" value={exp} onChange={handleexp} required/>

          <span></span>


          <label>Experience(in years):</label>

 
          </div>




  {/* <input type="radio" value="Male" id="male" onChange={handleAgeChange} />
  <label for="male">Male</label>
  <input type="radio" value="Female" id="male" onChange={handleAgeChange} />
  <label for="female">Female</label> */}



  <button className="login-otp-button" type="submit">Register</button>


         </form>
       </div>
   </div>


















    // <div className="doc-reg-container">
    //   <h1>Doctor Registration</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>Name:</label>
    //     <input type="text" value={Name} onChange={handleFirstNameChange} />


    //     <label>Age:</label>
    //     <input type="number" value={Age} onChange={handleAgeChange} />

    //     <label id="gen">Gender:</label>
    //     <select id="gender_dropdown" onChange={handlegender}>
    //         <option value="male">Male</option>
    //         <option value="female">Female</option>
    //         <option value="others">Others</option>
    //         <option value="Prefer not to say">Prefer not to say</option>
    //     </select><br/>
    //     {/* <input type="radio" value="Male" id="male" onChange={handleAgeChange} />
    //     <label for="male">Male</label>
    //     <input type="radio" value="Female" id="male" onChange={handleAgeChange} />
    //     <label for="female">Female</label> */}



    //     <label>Email:</label>
    //     <input type="email" value={email} placeholder="(optional)" onChange={handleEmailChange} />

    //     <label>Specialization:</label>
    //     <input type="text" value={spec} placeholder="" onChange={handlespec} />

    //     <label>Experience:</label>
    //     <input type="" value={exp} placeholder="(in years)" onChange={handleexp} />
 
    //     <button className="Login-doc-button" type="submit">Register</button>
    //   </form>
    // </div>
  );
}

export default Regdoc;
