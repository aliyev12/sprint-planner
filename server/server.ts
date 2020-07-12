import express from "express";
import path from "path";
import http from "http";
import socketio from "socket.io";
import { baseRoute } from "./routes";
import { formatMessage, botName } from "./utils";
import { Users } from "./data/Users";
import { Rooms } from "./data/Rooms";
import { EAction } from "./data/models";

const PORT = process.env.PORT || 3333;

// Instantiate in-memody data objects
const users = new Users();
const rooms = new Rooms(users);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set Routes
app.use("/", baseRoute);

/*=======================================================*/
/*====================  CONNECTION  =====================*/
/*=======================================================*/
io.on("connection", (socket) => {
  socket.on("join", ({ userName, roomId, roomName }, callback) => {
    if (!userName || !roomId)
      return callback({ error: "Missing user name or room ID" });

    const { user } = users.addUser({
      id: socket.id,
      name: userName,
      room: roomId,
    });

    // if (error) return callback(error);

    let roomData = { id: roomId, name: "unknown" };
    if (roomName && roomName !== "unknown") {
      const addData = rooms.addOrGetRoom({
        id: roomId,
        name: roomName,
      });
      if (addData) roomData = addData;
    } else {
      const getData = rooms.getRoom(roomId);
      if (getData) roomData = getData;
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
      users: users.getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = users.getUser(socket.id);

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

    const room = rooms.getRoom(roomId);
    if (room) {
      validationMessage.roomExists = true;
      validationMessage.roomData = room;
    }

    callback(validationMessage);
  });

  socket.on("updateCategories", (args, callback) => {
    const result = rooms.updateCategories(args);

    if (result && result.room) {
      io.to(args.roomId).emit("roomData", {
        room: result.room,
        users: users.getUsersInRoom(args.roomId),
      });
      socket.broadcast.to(args.roomId).emit("message", {
        user: botName,
        text: `Categories have been updated`,
      });
    }

    callback(result);
  });

  socket.on(
    "updateCategoryCards",
    ({ roomId, categoryId, unit, action }, callback) => {
      const result = rooms.updateCategoryCards(
        roomId,
        categoryId,
        unit,
        action
      );

      if (result && result.room) {
        io.to(roomId).emit("roomData", {
          room: result.room,
          users: users.getUsersInRoom(roomId),
        });
        socket.broadcast.to(roomId).emit("message", {
          user: botName,
          text: `Cards have been updated`,
        });
      }

      callback(result);
    }
  );

  socket.on("handleVotingSession", (args, callback) => {
    if (args.action === EAction.vote && args.vote) {
      args.vote.userId = socket.id;
    }
    const result = rooms.handleVotingSession(args);

    if (result && result.room) {
      let message = "";
      if (args.action === EAction.start) {
        message = "Start voting!";
      } else if (args.action === EAction.end) {
        message = "Voting is over.";
      } else if (args.action === EAction.save) {
        message = "Voting session has been saved.";
      }

      io.to(args.roomId).emit("roomData", {
        room: result.room,
        users: users.getUsersInRoom(args.roomId),
      });
      socket.broadcast.to(args.roomId).emit("message", {
        user: botName,
        text: message,
      });
    }

    callback(result);
  });

  /*=======================================================*/
  /*====================  DISCONNECT  =====================*/
  /*=======================================================*/
  socket.on("disconnecting", () => {
    rooms.teardownRooms(Object.keys(socket.rooms));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: botName,
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: rooms.getRoom(user.room),
        users: users.getUsersInRoom(user.room),
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
