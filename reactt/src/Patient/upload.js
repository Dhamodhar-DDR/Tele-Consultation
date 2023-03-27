import React from 'react';
import './upload.css';

const Modal = () => {
//   const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className="rx">
      <div className="modal-main">
        <h2 className="modal-heading">Book Appointment</h2>
        <form>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" rows="4" cols="50" />
          <br />
          <label htmlFor="healthRecords">Health Records:</label>
          <input type="file" id="healthRecords" name="healthRecords" />
          <br />
          <button className="book-now-btn">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
