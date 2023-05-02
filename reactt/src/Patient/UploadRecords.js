import React, { useState, useEffect} from 'react';
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';

import file_icon from './imgs/fileicon.svg';
import './styles/UploadRecords.css';
import HandleBookApp from './HandleBookApp';


function Modal ({toggle, upload_type, pat_id, app_id,docto_id})  {
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const[proceed, setpro] = useState(false);

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

   async function handleBookApp(doc_id,p_id) {

    console.log('In happ');
  
      
  
      
   
      console.log('In happ');
        // return async function() {
          console.log('In happ');
        const now = new Date(); // get current date and time
        const timestamp = now.toISOString(); // convert to ISO string
        console.log(timestamp); // prints something like "2023-03-18T14:25:48.123Z"
    
        const create_app_body = {
          bookingTime : timestamp,
          patientId : p_id,
          doctorId: doc_id,
          startTime : null,
          endTime : null,
          isFollowup: false,
          markForFollowup : false,
          status : 'waiting',
          description : ''
        }
        await fetch('http://localhost:8090/api/v1/appointment/create_appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
          body: JSON.stringify(create_app_body)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.appointmentId);
          console.log('about to nav to waiting page');
          nav({
            pathname: '/waiting_page',
            search: createSearchParams({
              doc_id: doc_id,
              pat_id: p_id,
              app_id: data.appointmentId
            }).toString()
          });
        })
        .catch(error => {
          console.log(error);
        });
  
      // }
  
  
      }


  const handleSubmit = (event) => {

    console.log('into handle submutx');

    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`files`, files[i]);
    }
    formData.append('names',names)
    formData.append('descriptions', descriptions)
    formData.append('patId', parseInt(pat_id))
    formData.append('appId', app_id)
    console.log(names);
    console.log(descriptions);
  
    fetch('http://localhost:8090/api/v1/health_records/upload', {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*' 
      },
      body: formData
    })
    .then(response => {
      // Handle the response from the server
      console.log(response);
      toggle("close");
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });

    if(upload_type=='from_sd')
    {
      console.log("into from sd");
      setpro(true);
      handleBookApp(docto_id, pat_id);

      // <HandleBookApp doc_id={docto_id} p_id={pat_id}/>
    


    }

    else
    {
      console.log("upload type is : ",upload_type);
      toggle("close");
    }
    // console.log('toggle val is ',toggle)

  };


  return (
    <div className='upload-files-modal'>
      <div className="upload-files-modal-content">
        <form className="FileUploader" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="FileUploader-header">
            <h2>Upload Health Records {upload_type}</h2>
          </div>
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
                  <label htmlFor={`name-${index}`}>Name:</label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    value={names[index]}
                    onChange={(event) => handleNameChange(event, index)}
                  />
                </div>
                <div className="FileUploader-detail">
                  {/* <label htmlFor={`description-${index}`}>Description:</label> */}
                  <textarea className='desc'
                    placeholder='Description (optional)'
                    rows="2" cols="70"
                    type="text"
                    id={`description-${index}`}
                    // value={descriptions[index]}
                    onChange={(event) => handleDescriptionChange(event, index)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddFiles}> Add Files</button>
          <button className="FileUploader-submit" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
        <button className="upload-files-modal-close" onClick={toggle("close")}>
            X
        </button> 
        </div>

        {/* {proceed && <HandleBookApp doc_id={docto_id} p_id={pat_id}/>} */}

       </div>    
  );
};

export default Modal;
