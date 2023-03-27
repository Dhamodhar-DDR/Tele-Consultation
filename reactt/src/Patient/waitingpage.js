import React, { useState, useEffect } from "react";
import { useSearchParams, createSearchParams, useNavigate } from 'react-router-dom';

import "./waitingpage.css";

const WaitingPage = () => {
    const nav = useNavigate()
    const [data, setData] = useState(null);
    const[searchParams] = useSearchParams();
  
    useEffect(() => {
        //Api call to get the just finished appointment. 
        const get_curr_app_body = {
            appId : searchParams.get("app_id")
        }

        const intervalId = setInterval(async() => {
            fetch('http://localhost:8090/api/v1/appointment/get_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify(get_curr_app_body)
            })
            .then((response) => response.text())
            .then((status) => {
                console.log(status)
                if(status === 'live')
                {
                    nav({
                        pathname: '/patient_call',
                        search: createSearchParams({
                          doc_id: searchParams.get("doc_id"),
                          pat_id: searchParams.get("pat_id"),
                          app_id: searchParams.get("app_id")
                        }).toString()
                    });
                } 
            });
        }, 5000);
      
        // Return a cleanup function that clears the interval when the component unmounts
        return () => {
          clearInterval(intervalId); // Stop the interval
        };
      }, []);

    return (
    <div className="waiting-page">
      <div className="loading-spinner"></div>
      <p className="waiting-text">You are added to the Queue. Please wait for your turn ..... </p>
    </div>
  );
};

export default WaitingPage;