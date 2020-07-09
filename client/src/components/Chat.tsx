import React, { useEffect, useState } from "react";
export const Chat = ({ location }) => null;

// import queryString from "query-string";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import io from "socket.io-client";

// let socket: SocketIOClient.Socket;

// export const Chat = ({ location }) => {
//   const ENDPOINT = "localhost:3333";

//   const chatMsgRef = React.useRef(null);

//   const [name, setName] = useState("");
//   const [room, setRoom] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const { name, room } = queryString.parse(location.search);
//     socket = io(ENDPOINT);

//     setName(name);
//     setRoom(room);

//     socket.emit("join", { name, room }, (error) => {
//       if (error) alert(error);
//     });

//     return () => {
//       socket.emit("disconnect");
//       socket.off("join");
//     };
//   }, [ENDPOINT, location.search]);

//   useEffect(() => {
//     socket.on("message", (message) => {
//       console.log(message);
//       setMessages([...messages, message]);
//     });
//     socket.on("roomData", ({ users }) => {
//       setUsers(users);
//     });

//     return () => {
//       socket.off("message");
//       socket.off("roomData");
//     };
//   }, [messages]);

//   // function for sending messages
//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (message) {
//       socket.emit("sendMessage", message, () => setMessage(""));
//     }
//   };

//   return (
//     <div className="chat-container">
//       <header className="chat-header">
//         <h1>
//           <i className="fas fa-smile"></i> ChatCord
//         </h1>
//         <Link to="/" className="btn">
//           Leave Room
//         </Link>
//         {/* <a href="index.html" className="btn">
//             Leave Room
//           </a> */}
//       </header>
//       <main className="chat-main">
//         <div className="chat-sidebar">
//           <h3>
//             <i className="fas fa-comments"></i> Room Name:
//           </h3>
//           <h2 id="room-name">{room}</h2>
//           <h3>
//             <i className="fas fa-users"></i> Users
//           </h3>
//           <ul id="users">
//             {users.map((u, i) => (
//               <li key={i}>{u.name}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="chat-messages" ref={chatMsgRef}>
//           {messages.map((m, i) => (
//             <p key={i}>
//               <strong>{m.user}:</strong> {m.text}
//             </p>
//           ))}
//         </div>
//       </main>
//       <div className="chat-form-container">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
//           id="msg"
//           type="text"
//           placeholder="Enter Message"
//           required
//           autoComplete="off"
//         />
//         <button className="btn" onClick={sendMessage}>
//           <i className="fas fa-paper-plane"></i> Send
//         </button>
//       </div>
//     </div>
//   );
// };
