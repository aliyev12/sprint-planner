import express from "express";
import path from "path";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { Server, Socket } from "socket.io";
import { baseRoute } from "./routes";
import {
  formatMessage,
  botName,
  toMilliseconds,
  MAX_USERS,
  MAX_ROOMS,
} from "./utils";
import { Users } from "./data/models/Users";
import { Rooms } from "./data/models/Rooms";
import { EAction, EUserRole, ERoomStatus } from "./data/models";
require("dotenv").config();

const PORT = process.env.PORT || 3333;

// Instantiate in-memory data objects
const users = new Users();
const rooms = new Rooms(users);

// Listen for an uncaughtException and if one takes place - shutdown the server
process.on("uncaughtException", (err) => {
  gracefullyShutdownServer(null, err, "UNCAUGHT EXCEPTION");
});

const app = express();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Limit requests from same API
const limiter = rateLimit({
  limit: 100, // Changed from 'max' to 'limit'
  windowMs: toMilliseconds("1 hour"),
  message: "Too many requests from this IP, please try again in an hour.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api", limiter);

// Load environment variables
const CLIENT_URLS = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : ["http://localhost:5173", "https://sprint-planner.aaliyev.com"];

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...CLIENT_URLS],
      },
    },
  })
);

const server = http.createServer(app);

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URLS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use cors to avoid cors error in browser
app.use(
  cors({
    origin: CLIENT_URLS,
    methods: ["GET", "POST"], // Adjust as needed
    credentials: true, // Include cookies if needed
  })
);

/*=======================================================*/
/*====================  CONNECTION  =====================*/
/*=======================================================*/

io.on("connection", handleSocket);

function handleSocket(socket: Socket) {
  // Log connection ID
  // Check why there are several connections for one user...

  socket.on("join", (props, callback) => {
    const { userName, userRole, roomId, roomName } = props;

    const rooms_ = io.sockets.adapter.rooms;
    const socketIsInRoom = rooms_.get(roomId)?.has(socket.id);

    if (socketIsInRoom) return callback({ message: "User has already joined" });

    // Check is max allowed number of users/rooms hasn't been reached
    if (checkCapacity().max) return callback(checkCapacity().payload);

    const joinResult = {
      user: null,
      error: null,
    };
    if (!userName || !roomId) {
      joinResult.error = "Missing user name or room ID";
      return callback(joinResult);
    }
    const { user } = users.addUser({
      id: socket.id,
      name: userName,
      role: userRole,
      room: roomId,
    });

    joinResult.user = user;

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

    socket.join(roomId);

    io.to(user.room).emit("roomData", {
      room: roomData,
      users: users.getUsersInRoom(user.room),
    });

    callback(joinResult);
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
      maxCapacity: false,
    };

    // Check is max allowed number of users/rooms hasn't been reached
    if (checkCapacity().max)
      return callback({
        ...validationMessage,
        ...checkCapacity().payload,
      });

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
    if (!isAdmin(socket.id))
      return callback({
        room: null,
        error: "You are not authorized to update categories",
      });

    const result = rooms.updateCategories(args);
    let message = `Categories have been updated::warning`;
    if (args.action === EAction.updateStatus) {
      if (args.status && args.status === ERoomStatus.edit) {
        message = `Categories are being edited by the admin::warning`;
      }
      if (args.status && args.status === ERoomStatus.initial) {
        message = `Categories are done being edited::success`;
      }
    }

    if (result && result.room) {
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

  socket.on(
    "updateCategoryCards",
    ({ roomId, categoryId, unit, action }, callback) => {
      if (!isAdmin(socket.id))
        return callback({
          room: null,
          error: "You are not authorized to update cards",
        });

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

      if (args.action === EAction.reset)
        io.to(args.roomId).emit("sessionReset");

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
    Array.from(socket.rooms.values()).filter((room) => room !== socket.id); // Filter out the socket's own room
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    // Get rooms where users still exist
    const usersInRooms = users.users
      .filter((user) => user.id !== socket.id) // Filter out this disconnected user
      .map((user) => user.room);

    // Only teardown rooms that have no users
    rooms.teardownRooms(usersInRooms);

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
}

server.listen(PORT, () =>
  console.log(
    "\x1b[45m\x1b[33m\x1b[1m%s\x1b[0m",
    ` Server running in ${process.env.NODE_ENV} on port ${PORT} `
  )
);

function isAdmin(id: string): boolean {
  const foundUser = users.getUser(id);
  if (!foundUser || foundUser.role !== EUserRole.admin) return false;
  return true;
}

function checkCapacity() {
  const maxCapacityError =
    "The app has currently reached its max capacity. Please, try again later";
  const isMax =
    users.users.length >= MAX_USERS || rooms.rooms.length >= MAX_ROOMS;
  let payload = null;
  if (isMax)
    payload = {
      maxCapacity: true,
      error: maxCapacityError,
    };

  return { max: isMax, payload };
}

// This function will exit node process and shutdown the server
const gracefullyShutdownServer = (serv: any, err: Error, errorType: string) => {
  const error = `${errorType}!,${
    serv ? " gracefully" : ""
  } shutting down the server. Error: ${err.name}: ${err.message}.`;
  console.log(error);
  console.log(err);
  if (serv) {
    serv.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/* ERROR EVENT LISTENERS HAVE TO BE AT THE BOTTOM OF THE FILE! */
process.on("unhandledRejection", (err: any) => {
  gracefullyShutdownServer(server, err, "UNHANDLED REJECTION");
});

/*
  // Ways to emit a message:

  1. Emit to single client 
    socket.emit("message", "Welcome to Sprint Planner");

  2. Emit to all except for the client that is connecting 
    socket.broadcast.emit();

  3. Emit to ALL the clients in general  
    io.emit();
*/
