import React from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';


async function HandleBookApp({doc_id,p_id}) {

  console.log('In happ');

    const[searchParams] = useSearchParams();

    const nav = useNavigate();
 
    console.log('In happ');
    //  return async function() {
        console.log('In happ');
      const now = new Date(); // get current date and time
      const timestamp = now.toISOString(); // convert to ISO string
      console.log(timestamp); // prints something like "2023-03-18T14:25:48.123Z"
  
      const create_app_body = {
        bookingTime : timestamp,
        patientId : p_id,
        doctorId: doc_id,
        startTime : null,
        endTime : null,
        isFollowup: false,
        markForFollowup : false,
        status : 'waiting',
        description : ''
      }
      await fetch('http://localhost:8090/api/v1/appointment/create_appointment', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jwtToken"),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(create_app_body)
      })
      .then(response => {if( !response.ok )

        console.log( response );
        else
        response.json();})
      .then(data => {
        console.log(data);
        console.log(data.appointmentId);
        console.log('about to nav to waiting page');
        nav({
          pathname: '/waiting_page',
          search: createSearchParams({
            doc_id: doc_id,
            pat_id: p_id,
            app_id: data.appointmentId
          }).toString()
        });
      })
      .catch(error => {
        console.log(error);
      });

      return(<div></div>);


    }
  // };

export default HandleBookApp;