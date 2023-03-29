import './homepat.css'

import React, { useState, useEffect } from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';



function Homepat(){

  const [showModal, setShowModal] = useState(false);

  const[searchParams] = useSearchParams();

  const nav = useNavigate();

  const pat_id = searchParams.get("pat_id");

  const handleAutoassign = () => {

    nav({
      pathname: '/modal',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });



  }

  const handleSelectDoc = () => {

    nav({
      pathname: '/select_doc',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }

  const handleManageProf = () => {
    nav({
      pathname: '/patlist',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }
  const handleAppoinHist = () => {
    nav({
      pathname: '/appoinhist',
      search: createSearchParams({
        pat_id: pat_id
      }).toString()
    });

  }


  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

    return (



      <div className="button-container">
      <div className="button dropdown">
        New Appointment
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={handleSelectDoc}>Choose a doctor</button>
          <button className="dropdown-item" onClick={handleAutoassign}>Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button dropdown">
        Follow Up Appointment
        <div className="dropdown-content">
          <button className="dropdown-item" onClick={handleAutoassign}>Assign Previous Doctor</button>

          <button className="dropdown-item" onClick={handleAutoassign}>Auto-assign a doctor</button>

        </div>
      </div>
      <div className="button" onClick={handleManageProf}>Manage Profiles</div>
      <div className="button" onClick={handleAppoinHist}>Appointment History</div>
    </div>



        




      );
      
    


    }

export default Homepat;