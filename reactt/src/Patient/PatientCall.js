import React,{ useState, useEffect, useRef} from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import * as AgoraRTM from "../agora-rtm-sdk-1.5.1";
import './styles/vc.css'
import './styles/PatientCall.css'
import mic_icon from '../imgs/icons/mic.png'
import cam_icon from '../imgs/icons/camera.png'

function PatientCall() {
    const nav = useNavigate();
    const[searchParams] = useSearchParams();
    const [isRightSideBarOpen, setisRightSideBarOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    var isConsultationActive = false;    
    var chat = 0;
    let APP_ID = "3750c264e1ce48108ee613f8f45e2fbe"

    let token = null;
    let uid = "p_"+String(localStorage.getItem('p_pat_id'))

    let client = useRef(null);
    let channel = useRef(null);


    let roomId = localStorage.getItem('p_doc_id')

    let localStream = useRef(null);
    let remoteStream;
    let peerConnection;

    const servers = {
        // iceServers:[
        //     {
        //         urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        //     }
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
        await get_doc_online_stat(localStorage.getItem('p_doc_id')).then(async(data) => {
            console.log("Consultation", isConsultationActive)
            console.log("Consultation", data)
            if(isConsultationActive)
            {
                console.log('Started !');
                client.current = await AgoraRTM.createInstance(APP_ID)
                await client.current.login({uid, token})

                channel.current = client.current.createChannel(roomId)
                await channel.current.join().then(() => {
                console.log('Joined channel', roomId);
                }).catch((err) => {
                    console.log(`Error logging in to Agora RTM: ${err}`);
                });

                channel.current.on('MemberJoined', handleUserJoined)
                channel.current.on('MemberLeft', handleUserLeft)
                channel.current.on('ChannelMessage', handleMyChat)

                client.current.on('MessageFromPeer', handleMessageFromPeer)

                localStream.current = await navigator.mediaDevices.getUserMedia(constraints)
                document.getElementById('user-1').srcObject = localStream.current
            }
        })
    }
    let handleMyChat = async(chat, memeberId) => {
        console.log('New message received')
        if (!isRightSideBarOpen) {
            setShowNotification(true);
        }
        let messages = JSON.parse(chat.text)
        console.log('Message: ', messages)
        // document.getElementById('ch').innerText = document.getElementById('ch').innerText+ "\nDoctor: " + messages['message'];
        const newDiv = document.createElement('div');
        newDiv.classList.add('chat-doc-msg');
        const divText = document.createTextNode("Doctor: " + messages['message']);
        newDiv.appendChild(divText);
        document.getElementById('ch2').appendChild(newDiv);
        document.getElementById('ch2').scrollTop = document.getElementById('ch2').scrollHeight;
        
    }

    let handleUserLeft = (MemberId) => {
        document.getElementById('user-2').style.display = 'none'
        document.getElementById('user-1').classList.remove('smallFrame')
        //If doctor leaves, patient should also leave
        handleLeaveCall();
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

        if(message.type === 'leave'){
            handleLeaveCall();
        }

    }

    let handleUserJoined = async (MemberId) => {
        console.log('A new user joined the channel:', MemberId)
        createOffer(MemberId)
    }


    let createPeerConnection = async (MemberId) => {
        peerConnection = new RTCPeerConnection(servers)

        remoteStream = new MediaStream()
        document.getElementById('user-2').srcObject = remoteStream
        document.getElementById('user-2').style.display = 'block'

        document.getElementById('user-1').classList.add('smallFrame')


        if(!localStream.current){
            localStream.current = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
            document.getElementById('user-1').srcObject = localStream.current
        }

        localStream.current.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream.current)
        })

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        }

        peerConnection.onicecandidate = async (event) => {
            if(event.candidate){
                client.current.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
            }
        }
    }

    let createOffer = async (MemberId) => {
        await createPeerConnection(MemberId)

        let offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        client.current.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
    }


    let createAnswer = async (MemberId, offer) => {
        await createPeerConnection(MemberId)

        await peerConnection.setRemoteDescription(offer)

        let answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)

        console.log("answer, ",answer," offer: ",offer)

        client.current.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
    }


    let addAnswer = async (answer) => {
        if(!peerConnection.currentRemoteDescription){
            peerConnection.setRemoteDescription(answer)
        }
    }


    let leaveChannel = async () => {
        await channel.current.leave()
        await client.current.logout()
    }

    let toggleCamera = async () => {
        let videoTrack = localStream.current.getTracks().find(track => track.kind === 'video')

        if(videoTrack.enabled){
            videoTrack.enabled = false
            document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }else{
            videoTrack.enabled = true
            document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
        }
    }

    let toggleMic = async () => {
        let audioTrack = localStream.current.getTracks().find(track => track.kind === 'audio')

        if(audioTrack.enabled){
            audioTrack.enabled = false
            document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }else{
            audioTrack.enabled = true
            document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
        }
    }

    let toggleChat = async () =>{

        if (chat){
            chat = 0
            document.getElementById('myChat').style.display = 'block'
            document.getElementById('cont').addEventListener('submit', sendMessage)
        }
        else{
            chat = 1
            document.getElementById('myChat').style.display = 'none'
        }
    }

    let displayChat = async (e) =>{
        e.preventDefault();
        console.log("closed")
        const message = document.getElementById('txt').value;
        sendMessage(message);
        // document.getElementById('ch').innerText = document.getElementById('ch').innerText+ "\nPatient: " + document.getElementById('txt').value;
        // document.getElementById('cont').scrollTop = document.getElementById('cont').scrollHeight;
        
        const newDiv = document.createElement('div');
        newDiv.classList.add('chat-pat-msg');
        const divText = document.createTextNode("Patient: " + message);
        newDiv.appendChild(divText);
        document.getElementById('ch2').appendChild(newDiv);
        document.getElementById('ch2').scrollTop = document.getElementById('ch2').scrollHeight;
        document.getElementById('txt').value = "";
    }

    let sendMessage = (message) => {
        channel.current.sendMessage({text:JSON.stringify({'type': 'chat', 'message': message})})
        console.log("message sent")
    }

    // window.addEventListener('mousemove', (e) => {
    //     e.preventDefault()
    //     let  myChat = document.getElementById('but')
    //     myChat.addEventListener('click', sendMessage)
    // })

    window.addEventListener('beforeunload', leaveChannel)

    const get_doc_online_stat = async(doc_id_param) => {
        const check_status_body = {
            'doctorID': doc_id_param
        }
        await fetch('http://localhost:8090/api/v1/doctor/check_online_status', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem("jwtToken"),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(check_status_body)
        })
        .then(response => response.json())
        .then(async(data) => {
            console.log(check_status_body);
            console.log("Online Status: ",data)
            isConsultationActive = data;
            return data;
        })
        .catch(error => {
            console.log("error getting online status")
            console.log(error);
        });
    }
    async function setAppStatus(status) {
        const set_status_body = {
            appId : localStorage.getItem('p_app_id'),
            value : status
        }
        const response =  await fetch('http://localhost:8090/api/v1/appointment/set_status', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem("jwtToken"),
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(set_status_body)
          })
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = response.json();
        console.log(data)
        return data;
    }

    async function setAppEndTime() {
        const now = new Date(); // get current date and time
        const timestamp = now.toISOString(); // convert to ISO string
        console.log(timestamp); // prints something like "2023-03-18T14:25:48.123Z"

        const set_end_time_body = {
            appId : localStorage.getItem('p_app_id'),
            value : timestamp
        }
        const response =  await fetch('http://localhost:8090/api/v1/appointment/set_end_time', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem("jwtToken"),
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(set_end_time_body)
          })
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = response.json();
        console.log(data)
        return data;
    }

    const handleLeaveCall = async(e) => {
      //e.preventDefault();
        const set_status_res = await setAppStatus("completed");
        const set_end_time_res = await setAppEndTime();
        await leaveChannel();

        nav('/call_summary');
        // nav({
        //     pathname: '/call_summary',
        //     search: createSearchParams({
        //         pat_id: searchParams.get("pat_id"),
        //         doc_id: searchParams.get("doc_id"),
        //         app_id: searchParams.get("app_id")
        //     }).toString()
        // });
        window.location.reload();
    }
    
    const toggleRightSidebar = () => {
        if(!isRightSideBarOpen) setShowNotification(false);
        setisRightSideBarOpen(!isRightSideBarOpen);
    };

    useEffect(() => {
        init().then(()=>{
            console.log(localStream)
        });
    },[]);

  return (
    <div className="video-call-pg">

        <div id="videos" style={{height:'100vh'}}>
          {/* <div className="rightbutton"> */}
            {/* <button className="leave-button" onClick={handleLeaveCall}>
              Leave Call
            </button> */}
           {/* </div> */}

            <video className="video-player" id="user-1" autoPlay playsInline>

            </video>
            <video className="video-player" id="user-2" autoPlay playsInline>

            </video>


            <div id="controls">
            <button className="patcall-leave-button" id="leave-btn" onClick={handleLeaveCall}>
              Leave Call
            </button>
            <div onClick={toggleCamera} className="control-container" id="camera-btn">
                <img src={cam_icon} />
            </div>
            <div onClick={toggleMic} className="control-container" id="mic-btn">
                <img src={mic_icon}/>
            </div>
            <button onClick={toggleRightSidebar} className={`pat-call-chat-open-btn ${showNotification ? "notification" : ""}`}>Chat</button>
        </div>
        </div>
        <div className={`right-sidebar ${isRightSideBarOpen ? 'open' : ''}`}>
            <button style = {{backgroundColor: "red"}} className="toggle-char-call-btn-inside" onClick={toggleRightSidebar}>x</button>
            {/* <h1 id="hch" className="headchat"> Chat </h1> */}
            <h1>Chat</h1>
            <div class="chat-popup" id="myChat">
            <form class="form-container" id="cont">
                <div id="ch2"></div>
                <label for="msg">Send a message</label>
                <textarea rows='4' id="txt" placeholder="Type message.." name="msg" required></textarea>
                <button id="but" type="submit" className="send-msg-btn" onClick={displayChat}>Send</button>
            </form>
            </div>
        </div>
    </div>
  );
}


export default PatientCall;

