

import React from "react";
import { useNavigate } from "react-router-dom";
import './pop.css'
import male_def_pp from '../imgs/male_def_pp.jpg';
import female_def_pp from '../imgs/fem_def_pp.png';
// import def_pp from '../src/imgs/profile.png'


function ProfileSelector() {

   const p1 = {id: 1, avatar: male_def_pp,name:"Veer", age: 21}
   const p2 = {id: 2, avatar: female_def_pp,name:"Nancy", age: 47}
   const p3 = {id: 3, avatar: male_def_pp,name:"Ethan", age: 63}

   const profiles = [p1,p2,p3];
   const nav = useNavigate();

   const onProfileSelect = (profile) => {
    nav('/select_doc');
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-close">
          &times;
        </div>
        <div className="popup-header">
          <h2>Select User</h2>
        </div>
        <div className="popup-profiles">
          {profiles.map((profile) => (
            <div
              className="popup-profile"
              key={profile.id}
              onClick={() => onProfileSelect(profile)}>
              <img className="profilepics" src={profile.avatar} alt={profile.name} />
              <h3>{profile.name}</h3>
              <p>{profile.age} years old</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileSelector;

















// function ProfileSelector() {

//    const p1 = {id: 1, avatar: "./imgs/p1.jpeg",name:"Veer", age: 21}
//    const p2 = {id: 2, avatar: "./imgs/p2.jpeg",name:"Rocky", age: 47}
//    const p3 = {id: 3, avatar: "./imgs/p3.jpeg",name:"Ethan", age: 63}

//    const profiles = [p1,p2,p3];

//    const onProfileSelect = () => {alert("Prof selected");};
//   return (
//     <div className="popup-overlay">
//       <div className="popup">
//         <div className="popup-close" >
//           &times;
//         </div>
//         <div className="popup-header">
//           {/* <img src="/netflix-logo.png" alt="Netflix logo" width="60" /> */}
//           <h2>Select User</h2>
//         </div>
//         <div className="popup-profiles">
//           {profiles.map((profile) => (
//             <div
//               className="popup-profile"
//               key={profile.id}
//               onClick={() => onProfileSelect(profile)}
//             >
//               <img src="p1.jpeg" alt={profile.name} />
//               <h3>{profile.name}</h3>
//               <p>{profile.age} years old</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfileSelector;
