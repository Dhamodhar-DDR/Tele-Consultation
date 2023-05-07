import React,{ useState, useEffect, useRef} from "react";
import { useSearchParams,createSearchParams, useNavigate } from 'react-router-dom';
import * as AgoraRTM from "../agora-rtm-sdk-1.5.1";
import './styles/vc.css'
import mic_icon from '../imgs/icons/mic.png'
import cam_icon from '../imgs/icons/camera.png'
import def_pp from '../imgs/profile.png'



function DoctorCall() {
    const [markForFollowUp, setMarkForFollowUp] = useState(false);
    const [savefu, setsavefu] = useState(false)

    const [isLive, setIsLive] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isConsultationActive, setIsConsultationActive] = useState(true);    
    const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState("");
    const [isRightSideBarOpen, setisRightSideBarOpen] = useState(false);
    
    const [isPatProf, setIsPatProf] = useState(false);
    const [isWritePres, setIsWritePres] = useState(false);
    const [isHealthRec, setIsHealthRec] = useState(false);
    const [isPresSent, setIsPresSent] = useState(false);
    
    const [inputFields, setInputFields] = useState([{ med_name : "", frequency: "", description : ""}]);
    const[followUpReason,setFollowUpReason]  = useState("");
    const[appointmentId,setAppointmentId] = useState(-1);
    const[patientId,setPatientId]  = useState(-1);
    const[patientName,setPatientName]  = useState("");
    const[patientAge,setPatientAge]  = useState("");
    const[patientGender,setPatientGender]  = useState("");
    const[patientMobile,setPatientMobile]  = useState("");
    const[patientEmail,setPatientEmail] = useState("");
    const[diagnosis,setDiagnosis] = useState("");
    const[patpresent, setpatpresent] = useState(false);
    const[prevDiagnosis,setPrevDiagnosis] = useState("");

    const [files,setFiles] = useState([]);
    const [init_files, setinitFiles] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    function getCurrentAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
      
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      
        return age;
      }


    const nav = useNavigate();
    const[searchParams] = useSearchParams();
    let chat = 0;
    let APP_ID = "3750c264e1ce48108ee613f8f45e2fbe"

    let token = null;
    let uid = "d_"+String(localStorage.getItem('d_doc_id'));

    let client = useRef(null);
    let channel = useRef(null);

    let roomId = localStorage.getItem('d_doc_id');

    let localStream = useRef(null);
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
        client.current = await AgoraRTM.createInstance(APP_ID)
        await client.current.login({uid, token})

        channel.current = client.current.createChannel(roomId)
        await channel.current.join()

        channel.current.on('MemberJoined', handleUserJoined)
        channel.current.on('MemberLeft', handleUserLeft)
        channel.current.on('ChannelMessage', handleMyChat)

        client.current.on('MessageFromPeer', handleMessageFromPeer)

        localStream.current = await navigator.mediaDevices.getUserMedia(constraints)

        document.getElementById('user-1').srcObject = localStream.current

    }

    let handleMyChat = async(chat, memeberId) => {
        console.log('New message received')
        if (!isRightSideBarOpen) {
            setShowNotification(true);
        }
        let messages = JSON.parse(chat.text)
        console.log('Message: ', messages)
        // document.getElementById('ch').innerText = document.getElementById('ch').innerText+ "\nPatient: " + messages['message'];
        const newDiv = document.createElement('div');
        newDiv.classList.add('chat-pat-msg');
        const divText = document.createTextNode("Patient: " + messages['message']);
        newDiv.appendChild(divText);
        document.getElementById('ch2').appendChild(newDiv);
        document.getElementById('ch2').scrollTop = document.getElementById('ch2').scrollHeight;

    }


    let handleUserLeft = (MemberId) => {
        console.log("User left: ", MemberId)
        document.getElementById('user-2').style.display = 'none'
        document.getElementById('user-1').classList.remove('smallFrame')
        const parent = document.getElementById("ch2");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        // setPatientAge("")
        // setPatientGender("")
        // setPatientName("")
        // setPatientMobile("")
        // setPatientEmail("")
        // setFiles([])
        // setpatpresent(false)
        // setMarkForFollowUp(false);
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
        localStorage.setItem('d_app_id', -1);
        // await peerConnection.close();
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
            console.log(document.getElementById('myChat'))
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
        // document.getElementById('ch').innerText = document.getElementById('ch').innerText+ "\nDoctor: " + document.getElementById('txt').value;
        
        const newDiv = document.createElement('div');
        newDiv.classList.add('chat-doc-msg');
        const divText = document.createTextNode("Doctor: " + message);
        newDiv.appendChild(divText);
        document.getElementById('ch2').appendChild(newDiv);
        document.getElementById('ch2').scrollTop = document.getElementById('ch2').scrollHeight;
        // document.getElementById('ch2').insertBefore(newDiv, parent.firstChild);
        // document.getElementById('ch').appendChild(newDiv);
        
        sendMessage(message);
        document.getElementById('cont').scrollTop = document.getElementById('cont').scrollHeight;
        document.getElementById('txt').value = "";
    }

    let sendMessage = (message) => {
        console.log('messagy',message)
        channel.current.sendMessage({text:JSON.stringify({'type': 'chat', 'message': message})})
        console.log("message sent")
    }


    // window.addEventListener('mousemove', (e) => {
    //     e.preventDefault()
    //     let  myChat = document.getElementById('but')
    //     myChat.addEventListener('click', sendMessage)
    // })

    window.addEventListener('beforeunload', leaveChannel)

    const get_prev_app_diag= async(pat_id) => {
        const check_status_body = {
            'patId': pat_id
        }
        await fetch('http://localhost:8090/api/v1/appointment/get_prev_app_diag', {
            method: 'POST',
            headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(check_status_body)
        })
        .then(response => {
            if (response['status'] == 401)
            {
            //   nav({
            //     pathname: '/login_doc'
            //   });
                handleLogout();
            }
            return response.text();
          })
        .then(data => {
            console.log("DESC", data)
            setPrevDiagnosis(data);
        })
        .catch(error => {
            console.log("error getting online status")
            console.log(error)
        });
    }
    const get_online_stat = async(doc_id_param) => {
        const check_status_body = {
            'doctorID': doc_id_param
        }
        await fetch('http://localhost:8090/api/v1/doctor/check_online_status', {
            method: 'POST',
            headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(check_status_body)
        })
        .then(response => {
            if (response['status'] == 401)
            {
            //   nav({
            //     pathname: '/login_doc'
            //   });
                handleLogout();
            }
            return response.json();
          })
        .then(data => {
            setIsConsultationActive(data);
        })
        .catch(error => {
            console.log("error getting online status")
            console.log(error)
        });
    }

    const set_status = async(param) =>{

        const set_online_status_body = {
            'doctorID' : localStorage.getItem('d_doc_id'),
            'online_status': param
        }
        console.log("bef await isconsulatationactive", param)

        await fetch('http://localhost:8090/api/v1/doctor/set_online_status', {
            method: 'POST',
            headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(set_online_status_body)
        })
        .then(response => {
            if (response['status'] == 401)
            {
            //   nav({
            //     pathname: '/login_doc'
            //   });
                handleLogout();
            }
            return response.json();
          })
        .then(data => {
            console.log("Online status: ",data)
            setIsConsultationActive(param)
        })
        .catch(error => {
            console.log(error)
        });
    }
    
    useEffect(()=>{
        document.body.classList.add('doc-call-body');
    },[])

    useEffect(() => {
      const interval = setInterval(() => {
        if(isLoading) handlenextPatient();
      }, 3000);
      return () => clearInterval(interval);
    }, [isLoading]);

    useEffect(() => {
        console.log(localStorage.getItem('d_pat_id'),localStorage.getItem('d_doc_id'),localStorage.getItem('d_app_id'))
        init().then(()=>{
            console.log(localStream)
        });
    },[]);

    const Consultation_Button = () =>
    {
        const toggleConsultation = async() =>
        {
            await set_status(false);

            nav('/DocHome');
            // nav({
            //     pathname: '/DocHome',
            //     search: createSearchParams({
            //     doc_id: searchParams.get("doc_id")
            //     }).toString()
            // });
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
        setPatientAge("")
        setPatientGender("")
        setPatientName("")
        setPatientMobile("")
        setPatientEmail("")
        setFiles([])
        setpatpresent(false)
        setMarkForFollowUp(false);
        console.log("Next patient is being called")
        console.log(appointmentId)
        console.log(localStorage.getItem("d_app_id"))
        //Api call to set appointment to completed status
        if(appointmentId != -1)
        {
            await channel.current.getMembers().then((members) => {
                console.log(`There are ${members.length} members in the channel`);
                console.log(members)
                for(const element of members)
                {
                    if(element === "p_"+String(patientId))
                    {
                        console.log("Removing patientId--------------------------------------");
                        client.current.sendMessageToPeer({text:JSON.stringify({'type':'leave', 'answer':'none'})}, "p_"+String(patientId))
                        break;
                    }
                }
            });

            setPatientAge("")
            setPatientGender("")
            setPatientName("")
            setPatientMobile("")
            setPatientEmail("")
            setFiles([])
            setpatpresent(false)
            setMarkForFollowUp(false);
            handleUserLeft(String(patientId));

            const set_app_status_body = {
                appId : appointmentId,
                value : "completed"
            }
            const set_status_response = await fetch('http://localhost:8090/api/v1/appointment/set_status', {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('jwtToken_doc'),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(set_app_status_body)
            })
            if (set_status_response['status'] == 401)
            {
                // nav({
                //     pathname: '/login_doc'
                // });
                handleLogout();
            }
            if(set_status_response.status != 200) console.log(set_status_response)
            else console.log("Changed previous appointment status to completed!")
        }

        const earliest_app_response_body = {
            docId: localStorage.getItem('d_doc_id')
        }
        const earliest_app_response = await fetch('http://localhost:8090/api/v1/appointment/get_earliest_waiting_app', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('jwtToken_doc'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(earliest_app_response_body)
        })
        if (earliest_app_response['status'] == 401)
        {
        //   nav({
        //     pathname: '/login_doc'
        //   });
            handleLogout();
        }

        try{
            const earliest_app = await earliest_app_response.json();
            setAppointmentId(earliest_app.appointmentId);
            setPatientId(earliest_app.patientId);
            console.log('E I E I O',earliest_app.patientId)

            setIsLoading(false);
            const get_pat_body_response = await fetch('http://localhost:8090/api/v1/patient/get_patient_by_id', {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem("jwtToken_doc"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({pat_id: earliest_app.patientId})
            })
            if (get_pat_body_response['status'] == 401)
            {
                // nav({
                //     pathname: '/login_doc'
                // });
                handleLogout();
            }
            const pat_details = await get_pat_body_response.json();
            setfollowup(earliest_app.followup)
            setPatientName(pat_details.name);
            // const curr_age = getCurrentAge(dob)
            setPatientAge(getCurrentAge(pat_details.dob));
            setPatientGender(pat_details.gender);
            setPatientMobile(pat_details.mobileNumber);
            setPatientEmail(pat_details.email);
            if(earliest_app.followup) get_prev_app_diag(earliest_app.patientId);
            setpatpresent(true);

            // await fetch('http://localhost:8090/api/v1/patient/get_appointment_by_id',{
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Origin': '*'
            //     },
            //     body: JSON.stringify({appId: earliest_app.appointmentId})
            // }).then(async(response)=>{
            //     const data = await response.json();
            // })
            // setPrevDiagnosis(earliest_app.description);


            

            //Change this appointment to live and connect the patient
            const set_app_status_body = {
                appId : earliest_app.appointmentId,
                value : "live"
            }
            const set_status_response = await fetch('http://localhost:8090/api/v1/appointment/set_status', {
                method: 'POST',
                headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
                    
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(set_app_status_body)
            })
            if (set_status_response['status'] == 401)
            {
                // nav({
                //     pathname: '/login_doc'
                // });
                handleLogout();
            }
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
        'Authorization': localStorage.getItem('jwtToken_doc'),
                        
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(set_start_time_body)
                })
                if (set_start_time_response['status'] == 401)
                {
                    // nav({
                    //     pathname: '/login_doc'
                    // });
                    handleLogout();
                }
                setIsPresSent(false)
                console.log("Next patient status changed!")
            }
            display_file(earliest_app.patientId);
        } catch(err) {
            console.log("No users!")
            setAppointmentId(-1);
            console.log(err)
        }
    }
    const consl = () =>{
        console.log('YYUUII',appointmentId);
    }
    const handleGetMembers = () =>
    {
        channel.current.getMembers().then((members) => {
            console.log(`There are ${members.length} members in the channel`);
            console.log(members)
            for(let i = 0;i<members.length;i++)
            {
                if(members[i] === "d_"+String(localStorage.getItem('d_doc_id')))
                {
                    console.log('Doctor exists')
                    break;
                }
            }
        });
    }

    const toggleLeftSidebar = () => {
        let menu_elem = document.getElementById("left-sidebar-menu");
        let writePres_elem = document.getElementById("left-sidebar-writePres");
        let healthRec_elem = document.getElementById("left-sidebar-healthRec");
        let patProf_elem = document.getElementById("left-sidebar-patProf");
        let elem = document.getElementById("toggle-menu-call-btn-id");
        if(isLeftSideBarOpen==="")
        {
            menu_elem.style.display = 'block';
            writePres_elem.style.display = 'none'
            healthRec_elem.style.display = 'none'
            patProf_elem.style.display = 'none'
            elem.style.display = 'none'; 
            setIsLeftSideBarOpen("open");
        }
        else {
            elem.style.display = 'block'
            setIsLeftSideBarOpen("");
            setIsWritePres(false);
            setIsHealthRec(false);
            setIsPatProf(false);
        }
    };

    const toggleRightSidebar = () => {
        if(!isRightSideBarOpen) setShowNotification(false);
        setisRightSideBarOpen(!isRightSideBarOpen);
    };

    const toggleFollowUp = async() => {

        
        // setsavefu(!savefu)
        if (markForFollowUp) setFollowUpReason(""); 
        const set_follow_up_body = {
            appId :  appointmentId,
            mark : !markForFollowUp,
            followupReason : followUpReason
        }
        await fetch('http://localhost:8090/api/v1/appointment/set_appointment_for_followup', {
            method: 'POST',
            headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(set_follow_up_body)
        })
        .then(response => {
            if (response['status'] == 401)
            {
            //   nav({
            //     pathname: '/login_doc'
            //   });
                handleLogout();
            }
            return response.text();
          })
        .then(data => {
            console.log("Online status: ",data)
            setMarkForFollowUp(!markForFollowUp);
            console.log("mark for followup is ,",markForFollowUp)
            if(markForFollowUp)
            {
                setsavefu(!savefu)
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

   
    
    const saveFollowup = async() => {
        setsavefu(!savefu)
        const set_follow_up_body = {
            appId :  appointmentId,
            mark : true,
            followupReason : followUpReason
        }
        console.log(followUpReason)
        await fetch('http://localhost:8090/api/v1/appointment/set_appointment_for_followup', {
            method: 'POST',
            headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),
                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(set_follow_up_body)
        })
        .then(response =>{
            if (response['status'] == 401)
            {
            //   nav({
            //     pathname: '/login_doc'
            //   });
                handleLogout();
            }
            return response.text();
          })
        .then(data => {
            console.log("Online status: ",data)
        })
        .catch(error => {
            console.log(error)
        });

    }

    const toggleWritePres = () =>{
        let menu_elem = document.getElementById("left-sidebar-menu");
        let writePres_elem = document.getElementById("left-sidebar-writePres");
        
        if(!isWritePres) {
            menu_elem.style.display = 'none'
            writePres_elem.style.display = 'block'
            setIsLeftSideBarOpen("writePres");
        }
        else {
            menu_elem.style.display = 'block';
            writePres_elem.style.display = 'none'
            setIsLeftSideBarOpen("open");
        }
        setIsWritePres(!isWritePres);
    }

    
    const toggleHealthRec = () =>{
        let menu_elem = document.getElementById("left-sidebar-menu");
        let healthRec_elem = document.getElementById("left-sidebar-healthRec");
        console.log(isHealthRec)
        if(!isHealthRec) {
            menu_elem.style.display = 'none'
            healthRec_elem.style.display = 'block'
            setIsLeftSideBarOpen("healthRec");
        }
        else {
            menu_elem.style.display = 'block';
            healthRec_elem.style.display = 'none'
            setIsLeftSideBarOpen("open");
        }
        setIsHealthRec(!isHealthRec)
    }

    const togglePatientProf = () =>{
        let menu_elem = document.getElementById("left-sidebar-menu");
        let patProf_elem = document.getElementById("left-sidebar-patProf");

        if(!isPatProf) {
            menu_elem.style.display = 'none'
            patProf_elem.style.display = 'block'
            setIsLeftSideBarOpen("patProf");
        }
        else {
            menu_elem.style.display = 'block';
            patProf_elem.style.display = 'none'
            setIsLeftSideBarOpen("open");
        }
        setIsPatProf(!isPatProf)
    }

    const handleFollowUpReason = (event)=>{
        setFollowUpReason(event.target.value)
    }
    const handleAddFields = () => {
        const values = [...inputFields];
        values.push({ med_name : "", frequency: "", description : "" });
        setInputFields(values);
    };
  
    const handleInput1Change = (index, event) => {
        const values = [...inputFields];
        values[index].med_name = event.target.value;
        setInputFields(values);
    };


    const handleInput2Change = (index, event) => {
        const values = [...inputFields];
        values[index].frequency = event.target.value;
        setInputFields(values);
    };

    const handleDiagChange = (event) => {
        event.preventDefault();
        setDiagnosis(event.target.value);
    };
    const handleInput3Change = (index, event) => {
        const values = [...inputFields];
        values[index].description = event.target.value;
        setInputFields(values);
    };

    const handleRemoveFields = (index) => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    const handleLogout = async() =>{
        await set_status(false)
        if(localStorage.getItem('d_pat_id') != null) localStorage.removeItem('d_pat_id');
        if(localStorage.getItem('d_mobile') != null) localStorage.removeItem('d_mobile');
        if(localStorage.getItem('d_doc_id') != null) localStorage.removeItem('d_doc_id');
        if(localStorage.getItem('d_app_id') != null) localStorage.removeItem('d_app_id'); 
        if(localStorage.getItem('d_app_id') != null) localStorage.removeItem('d_app_id'); 
        
        localStorage.removeItem('jwtToken_doc');
        nav('/login_doc');
        window.location.reload();
      }
  
    const display_file = async(pat_id) => {
      const formData = new FormData();
      formData.append('pat_id', pat_id)
      await fetch('http://localhost:8090/api/v1/health_records/get_record_by_pat_id',{
        method: 'POST',
        headers: {
        'Authorization': localStorage.getItem('jwtToken_doc'),

          // 'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*' 
        },
        // responseType: "json",
        body: formData
      })
      .then((response) => {
        if (response['status'] == 401)
        {
        //   nav({
        //     pathname: '/login_doc'
        //   });
            handleLogout();
        }
        return response.json();
      })
      .then((list) => {
          for(const element of list)
          {
            // console.log(element)
          fetch('data:'+element['headers']['Content-Type']+';base64,' + element['body'].data)
          .then(async(res)=>{
            const blob = await res.blob()
            // console.log(blob)
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                if(parseInt(element.body.appId) === parseInt(localStorage.getItem('d_app_id')))
                {
                  setinitFiles(current => [...current, {name : element.body.name, type: blob.type , url : fileReader.result}])
                }
                else setFiles(current => [...current, {name : element.body.name, type: blob.type , url : fileReader.result}])
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

    const handleFileClick = (file) => {
      setSelectedFile(file);
    }
  
    const handleCloseModal = () => {
      setSelectedFile(null);
    }
    
    const sendPres = async(e) => {
        
        e.preventDefault();
        const medNames_l = []
        const frequencies_l = []
        const descriptions_l = []
        for(const element of inputFields)
        {
            if(element.medName === "" || element.frequency === "") continue;
            else {
                medNames_l.push(element.med_name);
                frequencies_l.push(element.frequency);
                descriptions_l.push(element.description);
            }
        }
        console.log(appointmentId)

        const send_pres_body = {
            appId : appointmentId,
            medNames : medNames_l,
            frequencies : frequencies_l,
            descriptions : descriptions_l
        }
        await fetch('http://localhost:8090/api/v1/prescription/add_prescription',{
            method: 'POST',
            headers: {
              'Authorization': localStorage.getItem('jwtToken_doc'),
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify(send_pres_body)
        })
        .then(async(response) => {
            const send_pres_diag = {
                appId: appointmentId,
                description: diagnosis 
            }
                if (response['status'] == 401)
                {
                    handleLogout();
                //   nav({
                //     pathname: '/login_doc'
                //   });
                }
            console.log(send_pres_diag)
            await fetch('http://localhost:8090/api/v1/appointment/set_app_description',{
                method: 'POST',
                headers: {
                'Authorization': localStorage.getItem('jwtToken_doc'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
                },
                body: JSON.stringify(send_pres_diag )
            })
            .then(response2=>{
                if (response2['status'] == 401)
                {
                //   nav({
                //     pathname: '/login_doc'
                //   });
                    handleLogout();
                }
                console.log(response2)
                return response2.json();
              })
            .catch(err=>console.log(err))
            setIsPresSent(true);
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const [lm, setlm] = useState(false);
    
    const handleLoadMore = () => setlm(!lm);

    const [isfollowup, setfollowup] = useState(false);
    

    function handleClick() {
      setIsLoading(!isLoading);
    }

    return (
        <div>
            <div className="doc-call-main-content">
                {/* <button>asdasd</button> */}
                <button className="toggle-menu-call-btn" id="toggle-menu-call-btn-id" onClick={toggleLeftSidebar}>
                    ☰
                </button>
                {/* <button className="toggle-menu-call-btn" id="patnam" onClick={toggleLeftSidebar}>
                    Patient Name : {patientName}
                </button>
                <button id='pname' className={`controls ${isLeftSideBarOpen}`} >
                    Patient Name : {patientName}
                    </button> */}


                <div className={`left-sidebar ${isLeftSideBarOpen}`}>
                    <button className="close-left-sidebar-btn" onClick={toggleLeftSidebar}>X</button>
                    <div className="left-sidebar-menu" id="left-sidebar-menu">
                        <h1 className="left-sidebar-menu-heading">Patient Details</h1>
                        <ul>
                            <li onClick={togglePatientProf} className="first-elem">View patient profile </li>
                            <li onClick={toggleHealthRec}>View health records</li>
                            <li classname="write-pres" onClick={toggleWritePres} >Write prescriptions</li>
                            <li className={`mark-follow ${markForFollowUp ? 'open' : ''}`} onClick={toggleFollowUp}>{markForFollowUp ? 'Unmark':'Mark'} for follow up {markForFollowUp ? '✅':''}</li>
                        </ul>
                    {console.log("save state is : ", savefu)}
                    {(markForFollowUp&&!savefu) ? <div className="followup-reason"> <h4>Reason for follow up:</h4> <textarea onChange={handleFollowUpReason} rows = '7' cols = '40'></textarea><div><button className="savemark" onClick={saveFollowup}>Save</button></div></div>  : <></>}
                    </div>
                    
                    <div className="left-sidebar-patProf" id="left-sidebar-patProf">
                        <div className="go-back" >
                            <a href="#" onClick={togglePatientProf} className="previous">&#8249;</a>
                        </div>
                    <div className="patient-details">
                          <h2 className="details-header">Patient details</h2>
                          <img style={{marginLeft: "85px"}} className="doctor-photo" src={def_pp} alt="Doctor" />
                          <div className="details-item"><b>Name</b>: {patientName}</div>
                          <div className="details-item"><b>Age</b>: {patientAge}</div>
                          <div className="details-item"><b>Gender</b>: {patientGender}</div>
                          <div className="details-item"><b>Mobile Number</b>: {patientMobile}</div>
                          <div className="details-item"><b>Email</b>: {patientEmail}</div>
                    </div>
                    {isfollowup && <div className="patient-details" style={{marginTop:"30px"}}>
                       <h2 className="details-header">Previous Appointment Diagnosis</h2>
                          <div className="details-item">{prevDiagnosis}</div>
                    </div>}


                        {/* <div>
                            <h2>Patient details</h2>
                            <div><b>Name</b> : {patientName}</div>
                            <div><b>Age</b> : {patientAge}</div>
                            <div><b>Gender</b> : {patientGender}</div>

                        </div> */}
                    </div> 

                    <div className="left-sidebar-writePres" id="left-sidebar-writePres">
                        <div className="go-back" >
                            <a href="#" onClick={toggleWritePres} className="previous">&#8249;</a>
                        </div>
                        {!isPresSent ? 
                        (
                        <div>
                        {inputFields.length >= 0 ?<textarea required rows="5" cols="58" value={diagnosis} 
                         onChange={(event) => handleDiagChange(event)} className="diagnosis-input" type="text-area" placeholder="Diagnosis"></textarea>:""}
                        <div className="pres-scroll-unlock">
                        {inputFields.map((inputField, index) => (
                            <div className = "field" key={index}>
                                <div className="inputs">
                                    <input type="text" placeholder="Medicine Name" value={inputField.med_name} onChange={(event) => handleInput1Change(index, event)}/> 
                                    <input type="text" placeholder="Frequency" value={inputField.frequency} onChange={(event) => handleInput2Change(index, event)}/>
                                    <textarea rows="4" cols="56" type="text-area" placeholder="Description (if any)" value={inputField.description} onChange={(event) => handleInput3Change(index, event)}> </textarea>
                                </div>
                                <button className="bin" onClick={() => handleRemoveFields(index)}>🗑</button>
                            </div> 
                        ))}
                        </div>
                        {inputFields.length > 0 ?<p>*Prescriptions are auto saved</p>:""}
                        <div className="writePres-btn-div">
                            <button className="writePres-add-btn"onClick={handleAddFields}>Add prescription</button>
                            {inputFields.length > 0 ? <button className="writePres-add-btn" onClick={sendPres}>Send prescriptions</button> : ""}
                        </div></div>) : "Prescriptions are sent!"}
                    </div> 

                    <div className="left-sidebar-healthRec" id="left-sidebar-healthRec">
                        <div className="go-back" >
                            <a href="#" onClick={toggleHealthRec} className="previous">&#8249;</a>
                        </div>
                        <div className="doc-call-file-list">
                            <h1>Health records</h1>
                            <ul className="file-list">

                                <button onClick={handleLoadMore}> {lm ? 'Show Less' : 'Show More'}</button><br/>
                                {
                                    lm && (
                                        files.slice(4,files.length).map((file, index) => (
                                            <li key={index} onClick={() => handleFileClick(file)}>
                                                {file.name}
                                            </li>
                                        ))
                                    )
                                }

                                {files.slice(0,3).map((file, index) => (
                                <li key={index} onClick={() => handleFileClick(file)}>
                                    {file.name}
                                </li>
                                ))}

                            </ul>
                            {selectedFile && (
                                <div className="modal">
                                {selectedFile.type.substr(0,5) === 'image' ? (
                                    <img className="image-viewer" src={selectedFile.url} alt={selectedFile.name} />
                                ) : (
                                    <iframe className="pdf-viewer" src={`${selectedFile.url}`} type="application/pdf" title={selectedFile.name} />
                                )}
                                <button className="close-modal-btn" onClick={handleCloseModal}>X</button>
                                </div>
                            )}
                            <br/>
                        </div>
                    </div>
                </div>

                <div className={`content ${isLeftSideBarOpen}`}>
                    <div id="videos" className={`videos ${isLeftSideBarOpen}`} style={{height:'100vh'}}>
                        {patpresent && (<div id={`pname`} className = {`sttop ${isLeftSideBarOpen}`} > Patient Name : {patientName} </div>)}
                        <video className="doc-video-player" id="user-1" autoPlay playsInline></video>
                        <video className="doc-video-player" id="user-2" autoPlay playsInline></video>
                    </div>



                    <div id="doc-video-controls" className={`controls ${isLeftSideBarOpen}`}>

                        <div className={`vid-cb ${isLeftSideBarOpen}`}>
                            {Consultation_Button()} 
                        </div>
                        <div onClick={toggleCamera} className="control-container" id="camera-btn">
                            <img src={cam_icon} />
                        </div>
                        <div onClick={toggleMic} className="control-container" id="mic-btn">
                            <img src={mic_icon}/>
                        </div>

                        {/* <button className="next-patient-btn" onClick={handlenextPatient}>Next patient</button> */}
                        <button className={`np-button ${isLoading ? "loading" : ""}`} onClick={handleClick}>
                        {isLoading ? <div className="spinner"></div> : "Next Patient"}
                        </button>

                    </div>

                    <div id="patdetails" className={`controls ${isLeftSideBarOpen}`}></div>
                </div>
                <button className={`toggle-chat-btn ${showNotification ? "notification" : ""}`} onClick={toggleRightSidebar}>Chat</button>
            </div>
            <div className={`right-sidebar ${isRightSideBarOpen ? 'open' : ''}`}>
                <button style = {{backgroundColor: "rgba(227, 43, 43, 0.919);"}} className="toggle-char-call-btn-inside" onClick={toggleRightSidebar}>x</button>
                <h1 id="hch" className="headchat"> Chat </h1>
                <div className="chat-popup" id="myChat">
                    <form className="form-container" id="cont">
                        <div id="ch2"></div>
                        {/* <small id="ch">Welcome to tele-consultation app</small> */}
                        <label for="msg">Send a message</label>
                        <textarea rows='4' placeholder="Type message.." name="msg" id="txt" className="chat-text-area" required></textarea>
                        {/* <button id="but" className="chatsend" type="submit"  onClick={displayChat}>Send</button> */}
                        <button id="but" type="submit" className="send-msg-btn" onClick={displayChat}>Send</button>
                    </form>
                </div>
            </div> 
        </div>
    );
}

export default DoctorCall;