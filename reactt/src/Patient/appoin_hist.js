import './appoin_hist.css'

import React from 'react';



function AppoinHist() {
    const doctors = [
        {
          id: 1,
          name: "Dr. John Smith",
          photo: "https://via.placeholder.com/200",
          startTime: "9:00 AM",
          endTime: "10:00 AM"
        },
        {
          id: 2,
          name: "Dr. Jane Doe",
          photo: "https://via.placeholder.com/200",
          startTime: "11:00 AM",
          endTime: "12:00 PM"
        }
      ];
    
      return (
        <div>
         <nav className="navbar">
         <ul className="navbar-nav">
           <li className="nav-item">
             <a href="#" className="nav-link">
               Home
             </a>
           </li>
           <li className="nav-item">
             <a href="#" className="nav-link">
               Help
             </a>
          </li>
           <li className="nav-item">
             <a href="#" className="nav-link">
               Logout
             </a>
           </li>
         </ul>
       </nav>
          <div className="appointment-history">
          <h1>Appointment History</h1>
            <ul className="doctor-list">
              {doctors.map(doctor => (
                <li key={doctor.id}>
                  <div className="doctor-profile">
                    <img className="doctor-photo" src={doctor.photo} alt="Doctor" />
                    <div className="doctor-info">
                      <div className="doctor-name">{doctor.name}</div>
                      <div className="info-label">Call Start Time:</div>
                      <div className="info-value">{doctor.startTime}</div>
                      <div className="info-label">Call End Time:</div>
                      <div className="info-value">{doctor.endTime}</div>
                      <button>View Details</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
}

export default AppoinHist;
























// const AppoinHist = () => {

  

// const DoctorProfile = ({ startTime, endTime, name, photo }) => {
//   return (
//     <div className="doctor-profile">
//       <img className="doctor-photo" src={photo} alt={name} />
//       <div className="doctor-info">
//         <div className="info-label">Call Start Time:</div>
//         <div className="info-value">{startTime}</div>
//       </div>
//       <div className="doctor-info">
//         <div className="info-label">Call End Time:</div>
//         <div className="info-value">{endTime}</div>
//       </div>
//       <div className="doctor-info">
//         <div className="info-label">Doctor Name:</div>
//         <div className="info-value">{name}</div>
//       </div>
//     </div>
//   );
// };


//   const doctors = [
//     {
//       id: 1,
//       name: 'Dr. John Doe',
//       startTime: '9:00 AM',
//       endTime: '10:00 AM',
//     },
//     {
//       id: 2,
//       name: 'Dr. Jane Doe',
//       startTime: '10:00 AM',
//       endTime: '11:00 AM',
//     },
//     {
//       id: 3,
//       name: 'Dr. Joe Smith',
//       startTime: '11:00 AM',
//       endTime: '12:00 PM',
//     },
//   ];

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Home
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Help
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link">
//               Logout
//             </a>
//           </li>
//         </ul>
//       </nav>
//       <div className="doctor-list">
//         {doctors.map((doctor) => (
//           <DoctorProfile
//             key={doctor.id}
//             name={doctor.name}
//             startTime={doctor.startTime}
//             endTime={doctor.endTime}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AppoinHist;
