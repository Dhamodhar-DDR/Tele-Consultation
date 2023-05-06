import './styles/doc_appoin_hist.css'
import def_pp from '../imgs/profile.png'


import React, { useState, useEffect } from 'react';

import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';




function DocAppoinHist() {

  const nav = useNavigate()


  const[searchParams] = useSearchParams();
  const [prof_name, setprofname] = useState('')
  const[appoinlist, settappoinlist] = useState([])

  useEffect(() => {
    console.log("sess doc id: ",sessionStorage.getItem('doc_id'))
  //  get_prof_name_by_id()
    get_appoin_history()
    
    console.log("Received pat_id: ", sessionStorage.getItem('doc_id'));
    console.log("Received profilename pat_id: ", prof_name);

    
  }, [])

  const get_appoin_history = async() =>{

    const getappoinhist = {docId: sessionStorage.getItem('doc_id')}
    await fetch('http://localhost:8090/api/v1/appointment/get_doctor_appointments', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(getappoinhist)
  
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
      console.log("Online docs apoin list get profff: ",data)
      settappoinlist(data)  
     // console.log("After set profname ",prof_name)     
    })
    .catch(error => {
      console.log(error)
    });
  }

    const navToHome = () =>{

      nav('/DocHome');
      // nav({
      //   pathname: '/DocHome',
      //   search: createSearchParams({
      //     doc_id: searchParams.get('doc_id')
      //   }).toString()
      // });
    }
  
    const navToMngProfile = () =>{

      nav('/patlist');
      // nav({
      //   pathname: '/patlist',
      //   search: createSearchParams({
      //     doc_id: searchParams.get('doc_id')
      //   }).toString()
      // });
    }
  
    const navToAppHis = () =>{

      nav('/DocAppoinHist');
      // nav({
      //   pathname: '/DocAppoinHist',
      //   search: createSearchParams({
      //     doc_id: searchParams.get('doc_id')
      //   }).toString()
      // });

    }
    const convertTime=(curr) =>{
      if(curr!==null)
      {
        const df = new Date(curr);
        const date_str = String(df);
        return <>{date_str.substring(0,date_str.length-31)+" IST"}</>; //prints date in current locale
      }
      else return <></>
    }
    
      return (
        <div>
      <div className="navbar">
        <div>
          <button className="nav-button" onClick={navToHome}>Home</button>
          {/* <button onClick={navToMngProfile} className="nav-button">Manage Profile</button> */}
          <button className="nav-button" onClick={navToAppHis}>Appointment History</button>

            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
        <div>
        {/* <button className="nav-button1"><img  />{prof_name}</button> */}

          <button className="nav-button" >Logout</button>
        </div>
      </div>
          <div className="appointment-history">
          <h1>Patient Appointment History</h1>
          {appoinlist.length == 0? "No appointments":
            <ul className="doctor-list">
              {appoinlist.map(appointment => (
                <li key={appointment.appointment.appointmentId}>
                  <div className="doctor-profile">
                    <img className="doctor-photo" src={def_pp} alt="Doctor" />
                    <div className="doctor-info">
                      <div className="doctor-name">{appointment.name}</div>
                      <div className="info-label"><b>Call Start Time:</b> {convertTime(appointment.appointment.startTime)}</div>
                      {/* <div className="info-value">{doctor.startTime}</div> */}
                      <div className="info-label"><b>Call End Time:</b> {convertTime(appointment.appointment.endTime)}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      <div className="info-label"><b>Status: </b>{appointment.appointment.status}</div>
                      {/* <div className="info-value">{doctor.endTime}</div> */}
                      
                      <button>View Details</button>
                    </div>
                    
                  </div>
                </li>
              ))}
            </ul>}
          </div>
        </div>
      );
}

export default DocAppoinHist;
























// const AppoinHist = () => {

  

// const DoctorProfile = ({ startTime, endTime, name, photo }) => {
//   return (
//     <div className="doctor-profile">
//       <img className="doctor-photo" src={photo} alt={name} />
//       <div className="doctor-info">
//         <div className="info-label">Call Start Time:</div>
//         <div className="info-value">{startTime}</div>
//       </div>
//       <div className="doctor-info">
//         <div className="info-label">Call End Time:</div>
//         <div className="info-value">{endTime}</div>
//       </div>
//       <div className="doctor-info">
//         <div className="info-label">Doctor Name:</div>
//         <div className="info-value">{name}</div>
//       </div>
//     </div>
//   );
// };


//   const doctors = [
//     {
//       id: 1,
//       name: 'Dr. John Doe',
//       startTime: '9:00 AM',
//       endTime: '10:00 AM',
//     },
//     {
//       id: 2,
//       name: 'Dr. Jane Doe',
//       startTime: '10:00 AM',
//       endTime: '11:00 AM',
//     },
//     {
//       id: 3,
//       name: 'Dr. Joe Smith',
//       startTime: '11:00 AM',
//       endTime: '12:00 PM',
//     },
//   ];

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Home
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Help
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Logout
//             </a>
//           </li>
//         </ul>
//       </nav>
//       <div className="doctor-list">
//         {doctors.map((doctor) => (
//           <DoctorProfile
//             key={doctor.id}
//             name={doctor.name}
//             startTime={doctor.startTime}
//             endTime={doctor.endTime}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AppoinHist;
