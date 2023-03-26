import './homepat.css'

import React, { useState, useEffect } from 'react';


function Homepat(){

    return (

        <>
        <div className="navbar">
        <div>
        <button className="nav-button">Home</button>
        <button className="nav-button">Edit Profile</button>
        <button className="nav-button">Appointment History</button>

          {/* <a href="#">Edit Profile</a>
          <a href="#">Appointment History</a> */}
        </div>
        <div>
        <button className="nav-button" >Logout</button>
        </div>
      </div>


      <div className="button-container">
      <div className="button dropdown">
        New Appointment
        <div className="dropdown-content">
          <button className="dropdown-item">Choose a doctor</button>
          <button className="dropdown-item">Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button dropdown">
        Follow Up Appointment
        <div className="dropdown-content">
          <button className="dropdown-item">Assign Previous Doctor</button>
          <button className="dropdown-item">Auto-assign a doctor</button>
        </div>
      </div>
      <div className="button">Manage Profiles</div>
      <div className="button">Appointment History</div>
    </div>



        



        {/* <div className="button-container">
          <div className="button dropdown">
            New Appointment
            <div className="dropdown-content">
              <div className="dropdown-item">Choose a doctor</div>
              <div className="dropdown-item">Auto-assign a doctor</div>
            </div>
          </div>
          <div className="button dropdown">
            Follow Up Appointment
            <div className="dropdown-content">
              <div className="dropdown-item">Assign Previous Doctor</div>
              <div className="dropdown-item">Auto-assign a doctor</div>
            </div>
          </div>
          <div className="button">Manage Profiles</div>
          <div className="button">Appointment History</div>

        </div> */}

        </>
      );
      
    


    }

export default Homepat;