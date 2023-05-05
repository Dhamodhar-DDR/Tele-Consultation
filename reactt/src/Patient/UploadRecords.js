import React, { useState, useEffect} from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';

import file_icon from './imgs/fileicon.svg';
import './styles/UploadRecords.css';
import HandleBookApp from './HandleBookApp';


function Modal ({toggle, upload_type, pat_id, app_id,doctor_id})  {
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const[proceed, setpro] = useState(false);
  const [spec, setspec] = useState("General");

  const [da, setda] = useState(true)

  const nav = useNavigate();
  const handleFileUpload = (event) => {
    const newFiles = [...files];
    const newNames = [...names];
    const newDescriptions = [...descriptions];
    for (let i = 0; i < event.target.files.length; i++) {
      newFiles.push(event.target.files[i]);
      newNames.push(event.target.files[i].name);
      newDescriptions.push("-");
    }
    setFiles(newFiles);
    setNames(newNames);
    setDescriptions(newDescriptions);
  };

  const handleNameChange = (event, index) => {
    const newNames = [...names];
    newNames[index] = event.target.value;
    setNames(newNames);
  };

  const handleDescriptionChange = (event, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = event.target.value;
    setDescriptions(newDescriptions);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    const newNames = [...names];
    const newDescriptions = [...descriptions];
    newFiles.splice(index, 1);
    newNames.splice(index, 1);
    newDescriptions.splice(index, 1);
    setFiles(newFiles);
    setNames(newNames);
    setDescriptions(newDescriptions);
  };


  const handleAddFiles = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".pdf,.png";
    fileInput.addEventListener("change", handleFileUpload);
    fileInput.click();
  };

   async function handleBookApp(e) {
        e.preventDefault();
        
        const now = new Date(); // get current date and time
        const timestamp = now.toISOString(); // convert to ISO string
        
        let create_app_body = {};
        if(upload_type === 'from_sd')
        {
          create_app_body = {
            upload_type : upload_type,
            specialization : "",
            bookingTime : timestamp,
            patientId : pat_id,
            doctorId: doctor_id,
            isFollowup: false,
          }
        }
        else if(upload_type === 'upload-follow-prev')
        {
          create_app_body = {
            upload_type : upload_type,
            specialization : "",
            bookingTime : timestamp,
            patientId : pat_id,
            doctorId: null,
            isFollowup: true,
          }
        }
        else if(upload_type === 'upload-follow-auto')
        {
          create_app_body = {
            upload_type : upload_type,
            specialization : spec,
            bookingTime : timestamp,
            patientId : pat_id,
            doctorId: null,
            isFollowup: true,
          }
        }
        else if(upload_type === 'upload-auto')
        {
          create_app_body = {
            upload_type : upload_type,
            specialization : spec,
            bookingTime : timestamp,
            patientId : pat_id,
            doctorId: null,
            isFollowup: false,
          }
        }
        if(upload_type !== 'normal') 
        {
          await fetch('http://localhost:8090/api/v1/appointment/create_appointment', {
              method: 'POST',
              headers: {
                'Authorization': localStorage.getItem("jwtToken"),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
              },
              body: JSON.stringify(create_app_body)
          })
          .then(async(response) => {
            console.log(response);
            try{
              const data = await response.json();
              const formData = new FormData();
              if(files.length == 0)
              {
                sessionStorage.setItem('doc_id', data.doctorId);
                sessionStorage.setItem('app_id', data.appointmentId);
                sessionStorage.getItem('type',upload_type);

                nav('/waiting_page');

                // nav({
                //   pathname: '/waiting_page',
                //   search: createSearchParams({
                //     doc_id: data.doctorId,
                //     pat_id: pat_id,
                //     app_id: data.appointmentId,
                //     type: upload_type
                //   }).toString()
              //  });
              }
              else{
                for (let i = 0; i < files.length; i++) {
                  formData.append(`files`, files[i]);
                }
                formData.append('names',names)
                formData.append('descriptions', descriptions)
                formData.append('patId', parseInt(pat_id))
                formData.append('appId', data.appointmentId)
                console.log(names);
                console.log(descriptions);
              
                await fetch('http://localhost:8090/api/v1/health_records/upload', {
                  method: 'POST',
                  headers: {
                    'Authorization': localStorage.getItem("jwtToken"),
                    // 'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*' 
                  },
                  body: formData
                })
                .then(response2 => {
                  // Handle the response from the server
                  console.log(response2);
                  console.log(data.appointmentId);
                  console.log('about to nav to waiting page');
                  sessionStorage.setItem('doc_id', data.doctorId);
                  sessionStorage.setItem('app_id', data.appointmentId);
                  sessionStorage.getItem('type',upload_type);

                  nav('/waiting_page');
                  // nav({
                  //   pathname: '/waiting_page',
                  //   // search: createSearchParams({
                  //   //   doc_id: data.doctorId,
                  //   //   pat_id: pat_id,
                  //   //   app_id: data.appointmentId,
                  //   //   type: upload_type
                  //   // }).toString()
                //  });

                  // toggle("close");
                })
                .catch(error => {
                  console.error(error);
                });
              }
            }
            catch{
              console.log("NO doctor available with this specialization!")
              setda(false)
            } 
          })
          .catch(error => {
            console.log(error);
          });
        }
        else{
          //Write normal file upload api
        }
    }
    


  const handlespec = (e) => {

    setspec(e.target.value);
    console.log("Selected Spec: ",e.target.value)


  }


  const handleUpload = (event) => {

    console.log('into handle submutx');

    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`files`, files[i]);
    }
    formData.append('names',names)
    formData.append('descriptions', descriptions)
    formData.append('patId', parseInt(pat_id))
    formData.append('appId', -1)
  
    fetch('http://localhost:8090/api/v1/health_records/upload', { 
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("jwtToken"),
        // 'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*' 
      },
      body: formData
    })
    .then(response => {
      if( !response.ok ) console.log( response );
      return response.json();
    })
    .catch(error => {
      console.log(error)
    });
  };


  return (
    <div className='upload-files-modal'>
      <div className="upload-files-modal-content">
        <form className="FileUploader" encType="multipart/form-data" >
          <div className="FileUploader-header">
            <h2>{upload_type==="upload-follow-auto" || upload_type==="upload-auto"?"Choose Specialisation and ":""}Upload Health Records</h2>
          </div>
          {upload_type==="upload-follow-auto" || upload_type==="upload-auto"?
          <div className='selectspec-div'>
            <h3 className="selectspec-head">Select Specialisation </h3>
            <select className="selectspec" onChange={handlespec}>
              <option disabled>Select Specialisation</option>
              <option value="General">General</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Pulmonologist">Pulmonologist</option>
              <option value="Dentist">Dentist</option>
            </select>
          </div>:""}
          {/* {upload_type==="upload-follow-auto" || upload_type==="upload-auto"?<span><label >Select doctor specialization &nbsp; &nbsp;&nbsp;</label> <input onChange={(e)=>{setSpec(e.target.value)}}  type="text" placeholder="Specialization"/></span>:""} */}
          <div className='FileUploader-list'>
          {files.map((file, index) => (
            <div className="FileUploader-file" key={index}>
              <div>
              <img
                className="FileUploader-preview"
                src={file_icon}
                alt={`Uploaded file ${index}`}
              />
                <button type="button" onClick={() => handleRemoveFile(index)}>
                    Remove
                </button>
              </div>
              <div className="FileUploader-details">
                <div className="FileUploader-detail">
                  <label htmlFor={`name-${index}`}></label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    value={names[index]}
                    required
                    placeholder='Name (required)'
                    onChange={(event) => handleNameChange(event, index)}
                  />
                </div>
                <div className="FileUploader-detail">
                  <textarea className='desc'
                    placeholder='Description (optional)'
                    rows="2" cols="70"
                    type="text"
                    id={`description-${index}`}
                    onChange={(event) => handleDescriptionChange(event, index)}
                  />
                </div>
              </div>
            </div>
          ))}
          </div>
            <div className="FileUploader-btn-div">

          <button className="FileUploader-submit" type="button" onClick={handleAddFiles}> Add file</button>
          {upload_type!=="upload-normal"?<button className="FileUploader-submit" type="submit" onClick={handleBookApp}> Book appointment </button>:<button className="FileUploader-submit" type="submit" onClick={handleUpload}>Upload Records</button>}


          {
           (da == false)?(
            <>
            <br/>
            <br/>
              <p style={{color:"red"}}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Selected Specialization not available. </p>
            </>
           ):null

           }
          </div>

        </form>
        <button className="upload-files-modal-close" onClick={toggle("close")}>
            X
        </button> 
        </div>
       </div>    
  );
};

export default Modal;