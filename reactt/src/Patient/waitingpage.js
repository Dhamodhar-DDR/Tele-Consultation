import React, { useState, useEffect } from "react";
import { useSearchParams, createSearchParams, useNavigate } from 'react-router-dom';

import "./styles/waitingpage.css";

const WaitingPage = () => {
    const nav = useNavigate()
    const [queueCount, setqueueCount] = useState(-1);
    const[searchParams] = useSearchParams();
  
    useEffect(() => {
        //Api call to get the just finished appointment. 
        const get_curr_app_body = {
            appId : localStorage.getItem('p_app_id')
        }

        const intervalId = setInterval(async() => {
            fetch('http://localhost:8090/api/v1/appointment/get_queue_status', {
                method: 'POST',
                headers: {
                  'Authorization': localStorage.getItem("jwtToken"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify(get_curr_app_body)
            })
            .then((response) => {
              if (response['status'] == 401)
              {
                nav({
                  pathname: '/login_p'
                });
              }
              return response.json();
            }
            )
            .then(async(obj) => {
                if(obj.doctor_live == true)
                {
                  console.log('doctor_live');
                  if(obj.status === 'live')
                  {
                    nav('/patient_call')
                      // nav({
                      //     pathname: '/patient_call',
                      //     search: createSearchParams({
                      //       doc_id: searchParams.get("doc_id"),
                      //       pat_id: searchParams.get("pat_id"),
                      //       app_id: searchParams.get("app_id")
                      //     }).toString()
                      // });
                  } 
                  else{
                    setqueueCount(obj.count);
                  }
                }
                else if(obj.doctor_live == false) 
                {
                  console.log('doctor_live - false');
                  if(localStorage.getItem('p_type') === 'upload-auto' || localStorage.getItem('p_type') == 'upload-follow-auto')
                  {
                    console.log("type is ses: ",localStorage.getItem('p_type'));
                    const get_next_body = {
                      appId : localStorage.getItem('p_app_id'),
                    }
                    await fetch('http://localhost:8090/api/v1/appointment/get_next_best_doc', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' 
                      },
                      body: JSON.stringify(get_next_body)
                    })
                    .then(async(response)=>{
                        if (response['status'] == 401)
                        {
                          nav({
                            pathname: '/login_p'
                          });
                        }
                      const data = await response.json();
                      console.log(localStorage);
                      localStorage.setItem('p_doc_id',data);
                      // searchParams.set('doc_id', data);
                      const get_queue_body = {
                        appId : localStorage.getItem('p_app_id'),
                      }
                      fetch('http://localhost:8090/api/v1/appointment/get_queue_status', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Access-Control-Allow-Origin': '*' 
                          },
                          body: JSON.stringify(get_queue_body)
                      })
                      .then((response2) => {
                        if (response2['status'] == 401)
                        {
                          nav({
                            pathname: '/login_p'
                          });
                        }
                        return response2.json();
                      })
                      .then(obj => {
                        setqueueCount(obj.count)
                      })
                    })
                    .catch(async(err)=>{
                      console.log(err);
                      cancelAppointment();
                    })
                  }   
                  else
                  {
                    cancelAppointment();
                  }
                }
            });
        }, 2000);
      
        // Return a cleanup function that clears the interval when the component unmounts
        return () => {
          clearInterval(intervalId); // Stop the interval
        };
      }, []);
    
    const cancelAppointment = async()=>{
      console.log("CANCEL")
      const set_status_body = {
        appId : localStorage.getItem('p_app_id'),
        value : 'cancelled'
      }
      await fetch('http://localhost:8090/api/v1/appointment/set_status', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jwtToken"),
          
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify(set_status_body)
      }).then((response)=>{
          if (response['status'] == 401)
          {
            nav({
              pathname: '/login_p'
            });
          }
        nav('/call_summary');
        // nav({
        //   pathname: '/call_summary',
        //   search: createSearchParams({
        //       pat_id: localStorage.getItem('p_pat_id'),
        //       doc_id: localStorage.getItem('p_doc_id'),
        //       app_id: localStorage.getItem('p_app_id')
        //   }).toString()
        // });
      })
    }

    return (
    <div className="waiting-page">
      <div className="loading-spinner"></div>
      <p className="waiting-text">You are added to the Queue. Please wait for your turn ..... </p>
      <p>Number of appointments ahead in the queue : </p>
      {
        (queueCount == -1)?(
          <p> Loading...</p>
        ):(queueCount == 0)?<p>You are next!</p>:<p>{queueCount}</p>
      }
      <button onClick={cancelAppointment}>Cancel appointment</button>
    </div>
  );
};

export default WaitingPage;