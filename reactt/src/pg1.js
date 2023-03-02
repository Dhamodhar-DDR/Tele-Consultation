
import React from 'react';
import { useNavigate } from 'react-router-dom';

import './pg1.css'

function Page1() {
  const nav = useNavigate();

  const nav_doc_login = () => {nav('/login_doc')}

  const nav_pat_login = () => {nav('/login_p')}

  
  return (
    <div className="button-container">
      <button className="pg1-button" id='doctor' onClick={nav_doc_login}>Doctor Login</button>
      <button className="pg1-button" id='patient'onClick={nav_pat_login}>Patient Login</button>
    </div>
  );
}

export default Page1;
