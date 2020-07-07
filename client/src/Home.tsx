import React from "react";
// import queryString from "query-string";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import M from "materialize-css";
import "./Home.css";

// const ENDPOINT = "http://localhost:3333";
// const socket = io(ENDPOINT);

export const Home = () => {
  let _sidenav;
  let history = useHistory();
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("JavaScript");

  React.useEffect(() => {
    M.Sidenav.init(_sidenav);
  }, []);

  return (
    <div className="Home container">
      <div className="card-container">
        <div className="card hoverable">
          <div className="card-content black-text">
            <span className="card-title center">Sprint Planner</span>

            <a className="waves-effect waves-light btn-large blue darken-4 create-new-room-btn">
              <i className="material-icons left">add</i>create new room
            </a>
            <div className="or">or, join existing room:</div>
            <div className="input-field col s12">
              <input id="email" type="email" className="validate " />
              <label htmlFor="email">Room ID</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const Comp = () => {
//   return (
//     <div className="join-container">
//       <header className="join-header">
//         <h1>
//           <i className="fas fa-smile"></i> ChatCord
//         </h1>
//       </header>
//       <main className="join-main">
//         {/* <form
//         action="chat.html"
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (inputs.username) history.push("/chat");
//         }}
//       > */}
//         <div>
//           <div className="form-control">
//             <label htmlFor="username">Username</label>
//             <input
//               // value={inputs.username}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               // onChange={(e) =>
//               //   setInputs({
//               //     ...inputs,
//               //     username: e.target.value,
//               //   })
//               // }
//               type="text"
//               name="username"
//               id="username"
//               placeholder="Enter username..."
//               required
//             />
//           </div>
//           <div className="form-control">
//             <label htmlFor="room">Room</label>
//             <select
//               name="room"
//               id="room"
//               // value={inputs.room}
//               value={room}
//               onChange={(e) => setRoom(e.target.value)}
//               // onChange={(e) =>
//               //   setInputs({
//               //     ...inputs,
//               //     room: e.target.value,
//               //   })
//               // }
//             >
//               <option value="JavaScript">JavaScript</option>
//               <option value="Python">Python</option>
//               <option value="PHP">PHP</option>
//               <option value="C#">C#</option>
//               <option value="Ruby">Ruby</option>
//               <option value="Java">Java</option>
//             </select>
//           </div>
//           {/* <Link
//           onClick={(e) => (!name || !room ? e.preventDefault() : null)}
//           to={`/chat?name=${name}&room=${room}`}
//         > */}
//           <button
//             type="submit"
//             className="btn"
//             onClick={() => {
//               if (name && room) {
//                 history.push(`/chat?name=${name}&room=${room}`);
//               }
//             }}
//           >
//             Join Chat
//           </button>
//           {/* </Link> */}
//         </div>
//         {/* </form> */}
//       </main>
//     </div>
//   );
// };
