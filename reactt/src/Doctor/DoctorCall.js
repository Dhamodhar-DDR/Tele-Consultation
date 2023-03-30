import React,{ useState, useEffect, Component} from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import * as AgoraRTM from "../agora-rtm-sdk-1.5.1";
import './vc.css'
import mic_icon from '../imgs/icons/mic.png'
import cam_icon from '../imgs/icons/camera.png'

function DoctorCall() {
    const nav = useNavigate();
    const [isConsultationActive, setIsConsultationActive] = useState(true);    
    const[searchParams] = useSearchParams();
    var appointmentId = -1;
    var patientId = -1;
    
    let APP_ID = "3750c264e1ce48108ee613f8f45e2fbe"

    let token = null;
    let uid = "d_"+String(searchParams.get("doc_id"));
    
    let client;
    let channel;
    
    let roomId = searchParams.get("doc_id");
    
    let localStream;
    let remoteStream;
    let peerConnection;
    
    const servers = {
        // iceServers:[
        //     {
        //         urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        //     }
        // ]
        iceServers: [{
            urls: [ "stun:bn-turn1.xirsys.com" ]
         }, {
            username: "Yh4cKgXCeYNDluHkIMBH4uuYnaAlW0a_rGXKLNjDPuAoG1u_rSWbtjvxge8eN7sFAAAAAGQlFXJTcmluaXZhcw==",
            credential: "9ca7f90c-ceb6-11ed-8e86-0242ac140004",
            urls: [
                "turn:bn-turn1.xirsys.com:80?transport=udp",
                "turn:bn-turn1.xirsys.com:3478?transport=udp",
                "turn:bn-turn1.xirsys.com:80?transport=tcp",
                "turn:bn-turn1.xirsys.com:3478?transport=tcp",
                "turns:bn-turn1.xirsys.com:443?transport=tcp",
                "turns:bn-turn1.xirsys.com:5349?transport=tcp"
            ]
         }]
    }
    
    let constraints = {
        video:{
            width:{min:640, ideal:1920, max:1920},
            height:{min:480, ideal:1080, max:1080},
        },
        audio:true
    }
    
    let init = async () => {   
        client = await AgoraRTM.createInstance(APP_ID)
        await client.login({uid, token})
    
        channel = client.createChannel(roomId)
        await channel.join()
    
        channel.on('MemberJoined', handleUserJoined)
        channel.on('MemberLeft', handleUserLeft)
        
        client.on('MessageFromPeer', handleMessageFromPeer)
    
        localStream = await navigator.mediaDevices.getUserMedia(constraints)
        document.getElementById('user-1').srcObject = localStream
        
    }
     
    
    let handleUserLeft = (MemberId) => {
        console.log("User left: ", MemberId)
        document.getElementById('user-2').style.display = 'none'
        document.getElementById('user-1').classList.remove('smallFrame')
    }
    
    let handleMessageFromPeer = async (message, MemberId) => {
    
        message = JSON.parse(message.text)
    
        if(message.type === 'offer'){
            createAnswer(MemberId, message.offer)
        }
    
        if(message.type === 'answer'){
            addAnswer(message.answer)
        }
    
        if(message.type === 'candidate'){
            if(peerConnection){
                peerConnection.addIceCandidate(message.candidate)
                console.log("candidate: ",message.candidate)
            }
        }
    }
    
    let handleUserJoined = async (MemberId) => {
        console.log('A new user joined the channel:', MemberId)
        createOffer(MemberId)
    }
    
    
    let createPeerConnection = async (MemberId) => {
        peerConnection = new RTCPeerConnection(servers)
        // setPatientConnection(peerConnection);
        remoteStream = new MediaStream()
        document.getElementById('user-2').srcObject = remoteStream
        document.getElementById('user-2').style.display = 'block'
    
        document.getElementById('user-1').classList.add('smallFrame')
    
    
        if(!localStream){
            localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
            document.getElementById('user-1').srcObject = localStream
        }
    
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream)
        })
    
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        }
    
        peerConnection.onicecandidate = async (event) => {
            if(event.candidate){
                client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
            }
        }
    }
    
    let createOffer = async (MemberId) => {
        await createPeerConnection(MemberId)
    
        let offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
    
        client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
    }
    
    
    let createAnswer = async (MemberId, offer) => {
        await createPeerConnection(MemberId)
    
        await peerConnection.setRemoteDescription(offer)
    
        let answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
    
        client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
    }
    
    
    let addAnswer = async (answer) => {
        if(!peerConnection.currentRemoteDescription){
            peerConnection.setRemoteDescription(answer)
        }
    }
    
    
    let leaveChannel = async () => {
        await channel.leave()
        await client.logout()
        // await peerConnection.close();
    }
    
    let toggleCamera = async () => {
        let videoTrack = localStream.getTracks().find(track => track.kind === 'video')
    
        if(videoTrack.enabled){
            videoTrack.enabled = false
            document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }else{
            videoTrack.enabled = true
            document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
        }
    }
    
    let toggleMic = async () => {
        let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
    
        if(audioTrack.enabled){
            audioTrack.enabled = false
            document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }else{
            audioTrack.enabled = true
            document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
        }
    }
      
    window.addEventListener('beforeunload', leaveChannel)

    const get_online_stat = async(doc_id_param) => {
        const check_status_body = {
            'doctorID': doc_id_param
        }
        await fetch('http://localhost:8090/api/v1/doctor/check_online_status', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify(check_status_body)
        })
        .then(response => response.json())
        .then(data => {
            // console.log(check_status_body);
            // console.log("Online Status: ",data)
            setIsConsultationActive(data);
        })
        .catch(error => {
            console.log("error getting online status")
            console.log(error)
        });
    }

    const set_status = async(param) =>{

        const set_online_status_body = {
            'doctorID' : searchParams.get("doc_id"),
            'online_status': param      
        }
        console.log("bef await isconsulatationactive", param)
    
        await fetch('http://localhost:8090/api/v1/doctor/set_online_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify(set_online_status_body)
        })
        .then(response => response.text())
        .then(data => {
            console.log("Online status: ",data)
            setIsConsultationActive(param)
        })
        .catch(error => {
            console.log(error)
        });
    }

    useEffect(() => {
        init();
    },[]);

    const Consultation_Button = () => 
    {
        const toggleConsultation = async() => 
        {
            await set_status(false);
            nav({
                pathname: '/DocHome',
                search: createSearchParams({
                doc_id: searchParams.get("doc_id")
                }).toString()
            });
            leaveChannel();
            window.location.reload();
        }
        return (
          <div className="centered-button">
            <button
              className={`consultation-button ${isConsultationActive ? 'stop-consultation' : ''}`}
              onClick={toggleConsultation}
            >
              {isConsultationActive ? 'Stop Consultation' : 'Start Consultation'}
            </button>
          </div>
        );
    }

    const handlenextPatient = async()=>{
        console.log("Next patient is being called")
        console.log(appointmentId)
        //Api call to set appointment to completed status
        if(appointmentId != -1)
        {
            await channel.getMembers().then((members) => {
                console.log(`There are ${members.length} members in the channel`);
                console.log(members)
                for(const element of members)
                {
                    if(element === "p_"+String(patientId))
                    {
                        console.log("Removing patientId--------------------------------------");
                        client.sendMessageToPeer({text:JSON.stringify({'type':'leave', 'answer':'none'})}, "p_"+String(patientId))
                        break;
                    }
                }            
            });    
            
            handleUserLeft(String(patientId));
            
            const set_app_status_body = {
                appId : appointmentId,
                value : "completed"
            }
            const set_status_response = await fetch('http://localhost:8090/api/v1/appointment/set_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify(set_app_status_body)
            })
            if(set_status_response.status != 200) console.log(set_status_response)    
            else console.log("Changed previous appointment status to completed!")
        }
        
        const earliest_app_response_body = {
            docId: searchParams.get("doc_id")
        }
        const earliest_app_response = await fetch('http://localhost:8090/api/v1/appointment/get_earliest_waiting_app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify(earliest_app_response_body)
        })
        console.log(earliest_app_response)
        if(earliest_app_response.status != 200) console.log(earliest_app_response)
        else {
            const earliest_app = await earliest_app_response.json();
            console.log(earliest_app.appointmentId)
            
            //Change this appointment to live and connect the patient    
            const set_app_status_body = {
                appId : earliest_app.appointmentId,
                value : "live"
            }
            const set_status_response = await fetch('http://localhost:8090/api/v1/appointment/set_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify(set_app_status_body)
            })
            if(set_status_response.status != 200) console.log(set_status_response)    
            else{
                const now = new Date(); // get current date and time
                const timestamp = now.toISOString(); // convert to ISO string
                const set_start_time_body = {
                    appId : earliest_app.appointmentId,
                    value : timestamp
                }    
                const set_start_time_response = await fetch('http://localhost:8090/api/v1/appointment/set_start_time', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' 
                    },
                    body: JSON.stringify(set_start_time_body)
                })
    
                console.log("Next patient status changed!")
                appointmentId = earliest_app.appointmentId;
                patientId = earliest_app.patientId;
            }
        }
    }   

    const handleGetMembers = () =>
    {        
        channel.getMembers().then((members) => {
            console.log(`There are ${members.length} members in the channel`);
            console.log(members)
            for(let i = 0;i<members.length;i++)
            {
                if(members[i] === "d_"+String(searchParams.get("doc_id")))
                {
                    console.log('Doctor exists')
                    break;
                }
            }            
        });    
    }
    return (
        <div>
            {/* <button onClick={init}>Start connection</button> */}
            <div id="videos" >
                <video className="video-player" id="user-1" autoPlay playsInline></video>
                <video className="video-player" id="user-2" autoPlay playsInline></video>
            </div>
            <div id="controls">
                <div onClick={toggleCamera} className="control-container" id="camera-btn">
                    <img src={cam_icon} />
                </div>
                <div onClick={toggleMic} className="control-container" id="mic-btn">
                    <img src={mic_icon}/>
                </div>
            </div>
            {Consultation_Button()}
            <button onClick={handlenextPatient}>Next patient</button>
            <button onClick={handleGetMembers}>Get Members</button>
            
        </div>
    );
}

export default DoctorCall;

