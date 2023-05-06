import './styles/doc_appoin_hist.css'
import def_pp from '../imgs/profile.png'

import jspdf from "jspdf"

import React, { useState, useEffect } from 'react';

import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';




function DocAppoinHist() {

  const nav = useNavigate()
  
  const [showPopup, setShowPopup] = useState(false);
  const[searchParams] = useSearchParams();
  const [prof_name, setprofname] = useState('')
  const[appoinlist, settappoinlist] = useState([])

  useEffect(() => {
    console.log("sess doc id: ",localStorage.getItem('doc_id'))
   get_prof_name_by_id()
    get_appoin_history()
    
    console.log("Received pat_id: ", localStorage.getItem('doc_id'));
    console.log("Received profilename pat_id: ", prof_name);

    
  }, [])



const get_prof_name_by_id = async() => {

  const getdocidbody = {doctorID: localStorage.getItem('doc_id')}
  await fetch('http://localhost:8090/api/v1/doctor/get_doctor_by_id', {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem("jwtToken"),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
    body: JSON.stringify(getdocidbody)

  })
  .then(response => {
    if (response['status'] == 401)
    {
      localStorage.removeItem('jwtToken_doc')
      nav({
        pathname: '/login_doc'
      });
    }
    else return response.json();
  })
  .then(data => {
    setprofname(data.name)  
  })
  .catch(error => {
    console.log(error)
  });

}

  const get_appoin_history = async() =>{

    const getappoinhist = {docId: localStorage.getItem('doc_id')}
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
      else return response.json();
    })
    .then(data => {
      console.log("Online docs apoin list get profff: ",data)
      settappoinlist(data.reverse())  
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

    const generatePDF = (data,appointment,appointment_id, pat_name, doc_spec) => {
      const doc = new jspdf();
      let line_number = 1; 
      
      doc.setFont('Arial, sans-serif', 'bold');
      doc.setFontSize(24);
      doc.text('Tele Consultation Platform - Prescriptions', 10, line_number*10+10);
      line_number+=1;
      doc.setLineWidth(0.5);
      doc.setDrawColor(180, 180, 180);
      doc.line(10, line_number*10+8, 200, line_number*10+8); // x1, y1, x2, y2
      doc.setFont('Arial, sans-serif', 'normal');
      doc.setFontSize(14);
      line_number+=1;
      doc.text('Appointment Id    : ' + appointment_id, 10, line_number*10 + 10);
      line_number+=1;
      doc.text('Patient Name        : ' + pat_name, 10, line_number*10 + 10);
      line_number+=1;
      // doc.text('Patient Age: ' , 10, line_number*10 + 10);
      // line_number+=1;
      doc.text('Doctor Consulted : Dr.' + prof_name + ' (' + doc_spec +')', 10, line_number*10 + 10);
      line_number+=1;
      doc.text('Diagnosis              : ' + appointment.description, 10, line_number*10 + 10);
      line_number+=1;
      doc.line(10, line_number*10+5, 200, line_number*10+5); // x1, y1, x2, y2
      line_number+=1;

      if(data.length == 0) {
        doc.text('No prescriptions for this appointment', 10, line_number*10 + 10);
      }
      else{
        for(let i = 0;i<data.length;i++)
        {
          doc.text(String(i+1) + '. Medicine Name : ' + data[i].medName, 10, line_number*10 + 10);
          line_number+=1;
          doc.text('    Quantity : ' + data[i].quantity, 10, line_number*10 + 10);
          line_number+=1;
          doc.text('    Description : ' + data[i].description, 10, line_number*10 + 10);
          line_number+=1;
          line_number+=1;
        }
      }
      const pdfData = doc.output();
      const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
      const iframe = document.querySelector('.appHis-popup iframe');
      iframe.src = pdfUrl;
      console.log(showPopup)
      setShowPopup(true);
      document.getElementById("pres-view-popup").style.display = 'flex';
      // document.getElementById("pres-view-popup").style.display = 'block';
    };
    
    const viewPrescription = async(appointment,appId, pat_name, doc_spec) =>{
        const getpresbody = {appId: appId}
        await fetch('http://localhost:8090/api/v1/prescription/get_prescription', {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem("jwtToken"),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
          body: JSON.stringify(getpresbody)
        })
        .then(response => {
          if (response['status'] == 401)
          {
            localStorage.removeItem('jwtToken_doc')
            nav({
              pathname: '/login_doc'
            });
          }
          else return response.json();
        })
        .then(data => {
          console.log("Prescriptions: ",data)
          generatePDF(data,appointment,appId, pat_name, doc_spec);
        })
        .catch(error => {
          console.log(error)
        });
    } 

    const closePopup = () => {
      setShowPopup(false);
      document.getElementById("pres-view-popup").style.display = 'none';
    };

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
                      
                      <button onClick={()=>viewPrescription(appointment.appointment,appointment.appointment.appointmentId,appointment.name,appointment.specialization)}>View Details</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>}
            <div id="pres-view-popup" className="appHis-popup">
              <button className="appHis-popup-btn" onClick={closePopup}>X</button>
              <iframe id="pdf-frame" title="pdf" src="" width="90%" height="90%"></iframe>
            </div>
          </div>
        </div>
      );
}

export default DocAppoinHist;
