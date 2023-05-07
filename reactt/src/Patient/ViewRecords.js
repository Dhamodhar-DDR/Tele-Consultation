import React, { useEffect, useState } from "react";
import "./styles/displayFiles.css";
import { useSearchParams,createSearchParams, useNavigate} from "react-router-dom";

const DisplayFiles = () => {

  const nav = useNavigate();
  const [files,setFiles] = useState([]);
  useEffect(() => {
    display_file();
  }, [])
  const[searchParams] = useSearchParams();

  

  const display_file = async() => {
    const formData = new FormData();
    formData.append('pat_id', localStorage.getItem('p_pat_id'))
    await fetch('http://localhost:8090/api/v1/health_records/get_record_by_pat_id',{
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken"),
        // 'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*' 
      },
      // responseType: "json",
      body: formData
    })
    .then((response) => {
      if (response['status'] == 401)
      {
        handleLogout();
      }
      return response.json();
    })
    .then((list) => {
      console.log(list)
      for(const element of list)
      {
        fetch('data:'+element['headers']['Content-Type']+';base64,' + element['body'].data)
        .then(async(res)=>{
          const blob = await res.blob()
          console.log(blob)
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setFiles(current => [...current, {name : element.body.name, type: blob.type , url : fileReader.result}])
          };
          fileReader.readAsDataURL(blob);
        })
      }
      
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const[viewMore, setviewMore] = useState(false);

  const handleviewmore = () => {

    setviewMore(true);
  }

  const handleLogout = () =>{
    if(localStorage.getItem('p_pat_id') != null) localStorage.removeItem('p_pat_id');
        if(localStorage.getItem('p_mobile') != null) localStorage.removeItem('p_mobile');
        if(localStorage.getItem('p_doc_id') != null) localStorage.removeItem('p_doc_id');
        if(localStorage.getItem('p_app_id') != null) localStorage.removeItem('p_app_id'); 
        if(localStorage.getItem('p_upload') != null) localStorage.removeItem('p_upload');
        if(localStorage.getItem('p_type') != null) localStorage.removeItem('p_type'); 
        
    localStorage.removeItem('jwtToken');
    nav('/login_p')
  }
  
  const navToHome = () =>{

    nav('/home_pat');
    // nav({
    //   pathname: '/home_pat',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }

  const navToMngProfile = () =>{

    nav('/patlist');
    // nav({
    //   pathname: '/patlist',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }

  const handleAppoinHist = () => {
    nav('/appoinhist');
    // nav({
    //   pathname: '/appoinhist',
    //   search: createSearchParams({
    //     pat_id: searchParams.get('pat_id')
    //   }).toString()
    // });
  }


  const handleFileClick = (file) => {
    setSelectedFile(file);
  }
  const navToAppHis = () =>{
    // nav('/login_p')
  }


  const handleCloseModal = () => {
    setSelectedFile(null);
  }

  return (
<>
    <div className="navbar">

        <div>
          <button onClick={navToHome} className="nav-button">Home</button>
          <button onClick={navToMngProfile} className="nav-button">Manage Profile</button>
          <button onClick={handleAppoinHist} className="nav-button">Appointment History</button>
          
          

            {/* <a href="#">Edit Profile</a>
            <a href="#">Appointment History</a> */}
        </div>
       
        <div>
        {/* <button className="nav-button1"><img  />{prof_name}</button> */}
          <button className="nav-button" onClick={handleLogout}>Logout</button>
          
        </div>
      </div>

    <div className="App">


      <h1>File List</h1>
      <ul className="file-list">
        {files.map((file, index) => (
          <li className="ViewF" key={index} onClick={() => handleFileClick(file)}>
            {file.name}
          </li>
        ))}
      </ul>
      {selectedFile && (
        <div className="modal">
          {selectedFile.type.substr(0,5) === 'image' ? (
            <img src={selectedFile.url} alt={selectedFile.name} />
          ) : (
            <iframe src={`${selectedFile.url}#view=fitH`} type="application/pdf" title={selectedFile.name} height="100%" width="100%" />
          )}
          <button onClick={handleCloseModal}>X</button>
        </div>
      )}
      <br/>
    </div>
    </>
  );
};

export default DisplayFiles;
