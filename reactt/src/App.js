import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Logincg from './Patient/Logincg';
import Regc from './Patient/Regc';
import ProfileSelector from './Patient/pop';
import Regdoc from './Doctor/Reg';
import Logindoc from './Doctor/Login';
import DocHome from './Doctor/DocHome';
import Page1 from './pg1';
import DoctorList from './Patient/select_doc';
import DoctorCall from './Doctor/DoctorCall'
import PatientCall from './Patient/PatientCall'
function App() 
{
  return (
  <Router>
    <Routes>
      <Route exact path="/" element={<Page1 />} />
      <Route exact path="/login_p" element={<Logincg />} />     
      <Route exact path="/register_p" element={<Regc />} />
      <Route exact path="/login_doc" element={<Logindoc />} />
      <Route path="/register_doc" element={<Regdoc />} />
      <Route path="/DocHome" element={<DocHome />} />
      <Route path="/select_doc" element={<DoctorList />} />
      <Route path="/selectprofile" element={<ProfileSelector/>}/> 
      <Route path="/patient_call" element={<PatientCall/>}/> 
      <Route path="/doctor_call" element={<DoctorCall/>}/> 
      {/* <Route exact path="/" element={<Logindoc />} />
      <Route path="/register" element={<Regdoc />} /> */}
    </Routes>
  </Router>    
  );
}
export default App;