import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Modal from './Patient/upload';
import AddProf from './Patient/AddProf';
import DoctorList from './Patient/manageprof';



import reportWebVitals from './reportWebVitals';
import Homepat from './Patient/homepat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <div>
    <App />
    {/* <AddProf/> */}
    {/* <DoctorList/> */}
    {/* <Modal/> */}
    </div>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
