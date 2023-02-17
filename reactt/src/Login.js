import './Login.css'
import { useState } from "react";

function Login()
{

   const [clickbool, setclickbool] = useState(false);
   
   const handleclick = () => 
   {
     setclickbool(!clickbool);
   //alert("Hurray");
   }

    return(

    <>

    <div id='inb'>
    <br/>
        <h1 id='Loginhead'>Login</h1><br/>
        <div id='details'><br/><br/>
        <input id='num' type="number" placeholder='registered-number'/><br/>
        <button className='bc1' onClick={handleclick}>Get OTP</button><br/><br/>
        {
        clickbool? (
        <>
        <input id='OTP' type='password' placeholder='Enter OTP'/>
        <button className='bc1'> Submit </button> 
        </>
        
        ): null}

        </div>
        
        
        
        
    </div>
    
    
    </>



    )

}

export default Login;
