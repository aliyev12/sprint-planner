import express from "express";
import path from "path";
import http from "http";
import socketio from "socket.io";
import { baseRoute } from "./routes";
import {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  IUser,
  addOrGetRoom,
  getRoom,
} from "./users";
import { formatMessage, botName } from "./utils";

const PORT = process.env.PORT || 3333;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set Routes
app.use("/", baseRoute);

io.on("connection", (socket) => {
  socket.on("join", ({ userName, roomId, roomName }, callback) => {
    if (!userName || !roomId)
      return callback({ error: "Missing user name or room ID" });

    const { error, user } = addUser({
      id: socket.id,
      name: userName,
      room: roomId,
    });

    if (error) return callback(error);

    let roomData = { id: roomId, name: "unknown" };
    if (roomName && roomName !== "unknown") {
      const addData = addOrGetRoom({
        id: roomId,
        name: roomName,
      });
      if (addData)
        roomData = addOrGetRoom({
          id: roomId,
          name: roomName,
        });
    } else {
      const getData = getRoom(roomId);
      if (getData) roomData = getRoom(roomId);
    }

    /** Emit welcome message to single client who has just connected */
    socket.emit("message", {
      user: botName,
      text: `${user.name}, welcome to ${
        roomData ? "the room " + roomData.name : "Sprint Planner"
      }!`,
    });
    /** Emit to all in room except for the client that is connecting */
    socket.broadcast.to(user.room).emit("message", {
      user: botName,
      text: `${user.name}, has joined!`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: roomData,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (user && user.room && user.name) {
      io.to(user.room).emit("message", { user: user.name, text: message });
    }

    callback();
  });

  socket.on("validateRoomExists", ({ roomId }, callback) => {
    const validationMessage = {
      error: null,
      roomExists: false,
      roomData: null,
    };

    if (!roomId)
      return callback({ ...validationMessage, error: "Wrong room ID" });

    const room = getRoom(roomId);
    if (room) {
      validationMessage.roomExists = true;
      validationMessage.roomData = room;
    }

    // if (user && user.room && user.name) {
    //   io.to(user.room).emit("message", { user: user.name, text: message });
    // }

    callback(validationMessage);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: botName,
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(
    "\x1b[45m\x1b[33m\x1b[1m%s\x1b[0m",
    ` Server running in ${process.env.NODE_ENV} on port ${PORT} `
  )
);

/*
  // Ways to emit a message:

  1. Emit to single client 
    socket.emit("message", "Welcome to Sprint Planner");

  2. Emit to all except for the client that is connecting 
    socket.broadcast.emit();

  3. Emit to ALL the clients in general  
    io.emit();
*/
