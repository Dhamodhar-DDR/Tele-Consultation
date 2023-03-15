import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Logincg from './Logincg';
import Regc from './Regc';
import ProfileSelector from './pop';
import Regdoc from './Doctor/Reg';
import Logindoc from './Doctor/Login';
import DocHome from './Doctor/DocHome';
import Page1 from './pg1';
import DoctorList from './select_doc';
import VideoCall from './VideoCall/videocall.component'

function App() 
{
  const tst = "Test Text";
  return (

    // <div class="test">
    //   <DocHome/>
    // </div>
    
  <Router>
    <Routes>
      
      <Route exact path="/" element={<Page1 />} />
      <Route exact path="/video_call" element={<VideoCall />} />
      <Route exact path="/login_p" element={<Logincg />} />     
      <Route exact path="/register_p" element={<Regc />} />
      <Route exact path="/login_doc" element={<Logindoc />} />
      <Route path="/register_doc" element={<Regdoc />} />
      <Route path="/DocHome" element={<DocHome />} />
      <Route path="/select_doc" element={<DoctorList />} />
      <Route path="/selectprofile" element={<ProfileSelector/>}/> 
      {/* <Route exact path="/" element={<Logindoc />} />
      <Route path="/register" element={<Regdoc />} /> */}
    

    </Routes>
  </Router>

   

    
    
  );
}
export default App;