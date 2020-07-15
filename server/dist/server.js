"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const utils_1 = require("./utils");
const Users_1 = require("./data/models/Users");
const Rooms_1 = require("./data/models/Rooms");
const models_1 = require("./data/models");
const PORT = process.env.PORT || 3333;
// Instantiate in-memody data objects
const users = new Users_1.Users();
const rooms = new Rooms_1.Rooms(users);
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
io.origins("*:*");
// Set Routes
app.use("/", routes_1.baseRoute);
app.use(cors_1.default({
    origin: "https://sprintplannerapp.herokuapp.com/",
}));
/*=======================================================*/
/*====================  CONNECTION  =====================*/
/*=======================================================*/
io.on("connection", (socket) => {
    socket.on("join", ({ userName, roomId, roomName }, callback) => {
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
            room: roomId,
        });
        joinResult.user = user;
        let roomData = { id: roomId, name: "unknown" };
        if (roomName && roomName !== "unknown") {
            const addData = rooms.addOrGetRoom({
                id: roomId,
                name: roomName,
            });
            if (addData)
                roomData = addData;
        }
        else {
            const getData = rooms.getRoom(roomId);
            if (getData)
                roomData = getData;
        }
        /** Emit welcome message to single client who has just connected */
        socket.emit("message", {
            user: utils_1.botName,
            text: `${user.name}, welcome to ${roomData ? "the room " + roomData.name : "Sprint Planner"}!`,
        });
        /** Emit to all in room except for the client that is connecting */
        socket.broadcast.to(user.room).emit("message", {
            user: utils_1.botName,
            text: `${user.name}, has joined!`,
        });
        socket.join(roomId);
        // socket.join(user.room);
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
        };
        if (!roomId)
            return callback(Object.assign(Object.assign({}, validationMessage), { error: "Wrong room ID" }));
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
                user: utils_1.botName,
                text: `Categories have been updated`,
            });
        }
        callback(result);
    });
    socket.on("updateCategoryCards", ({ roomId, categoryId, unit, action }, callback) => {
        const result = rooms.updateCategoryCards(roomId, categoryId, unit, action);
        if (result && result.room) {
            io.to(roomId).emit("roomData", {
                room: result.room,
                users: users.getUsersInRoom(roomId),
            });
            socket.broadcast.to(roomId).emit("message", {
                user: utils_1.botName,
                text: `Cards have been updated`,
            });
        }
        callback(result);
    });
    socket.on("handleVotingSession", (args, callback) => {
        if (args.action === models_1.EAction.vote && args.vote) {
            args.vote.userId = socket.id;
        }
        const result = rooms.handleVotingSession(args);
        if (result && result.room) {
            let message = "";
            if (args.action === models_1.EAction.start) {
                message = "Start voting!";
            }
            else if (args.action === models_1.EAction.end) {
                message = "Voting is over.";
            }
            else if (args.action === models_1.EAction.save) {
                message = "Voting session has been saved.";
            }
            io.to(args.roomId).emit("roomData", {
                room: result.room,
                users: users.getUsersInRoom(args.roomId),
            });
            socket.broadcast.to(args.roomId).emit("message", {
                user: utils_1.botName,
                text: message,
            });
        }
        callback(result);
    });
    /*=======================================================*/
    /*====================  DISCONNECT  =====================*/
    /*=======================================================*/
    socket.on("disconnecting", () => {
        rooms.teardownRooms(Object.keys(io.sockets.adapter.rooms));
    });
    // Runs when client disconnects
    socket.on("disconnect", () => {
        rooms.teardownRooms(Object.keys(io.sockets.adapter.rooms));
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", {
                user: utils_1.botName,
                text: `${user.name} has left.`,
            });
            io.to(user.room).emit("roomData", {
                room: rooms.getRoom(user.room),
                users: users.getUsersInRoom(user.room),
            });
        }
    });
});
server.listen(PORT, () => console.log("\x1b[45m\x1b[33m\x1b[1m%s\x1b[0m", ` Server running in ${process.env.NODE_ENV} on port ${PORT} `));
/*
  // Ways to emit a message:

  1. Emit to single client
    socket.emit("message", "Welcome to Sprint Planner");

  2. Emit to all except for the client that is connecting
    socket.broadcast.emit();

  3. Emit to ALL the clients in general
    io.emit();
*/
