import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Logincg from './Logincg';
import Regc from './Regc';
import ProfileSelector from './pop';
import Login from './Login';


function App() 
{
  const tst = "Test Text";
  return (
    
  <Router>
    <Routes>
      <Route exact path="/" element={<Logincg />} />
      <Route path="/register" element={<Regc />} />
      <Route path="/selectprofile" element={<ProfileSelector/>}/>
    </Routes>
  </Router>

   

    
    
  );
}
export default App;