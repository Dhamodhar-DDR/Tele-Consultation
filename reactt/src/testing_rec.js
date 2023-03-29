
import React, { useState } from 'react';
import './testing_rec.css'


function SlideOver() {
  const [show, setShow] = useState(false);

  const handleButtonClick = () => {
    setShow(true);
  };

  const handleCloseClick = () => {
    setShow(false);
  };

  return (
    <>
      <button onClick={handleButtonClick}>View Records</button>
      <div className={`slide-over ${show ? 'show' : ''}`}>
        <div className="slide-over-header">
          <h3>Slide Over Title</h3>
          <span className="slide-over-close" onClick={handleCloseClick}>X</span>
        </div>
        <div className="slide-over-content">
          <p>Slide over content goes here.</p>
        </div>
      </div>

      <div><h1>asdgaaaaaaaaaaa</h1><p>This is some sample trexpajspfoj</p>
      </div>
    </>
  );
}

export default SlideOver;
