"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import socketio from "socket.io";
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const utils_1 = require("./utils");
const Users_1 = require("./data/models/Users");
const Rooms_1 = require("./data/models/Rooms");
const models_1 = require("./data/models");
const PORT = process.env.PORT || 3333;
// Instantiate in-memody data objects
const users = new Users_1.Users();
const rooms = new Rooms_1.Rooms(users);
// Listen for an uncaughtException and if one takes place - shutdown the server
process.on("uncaughtException", (err) => {
    gracefullyShutdownServer(null, err, "UNCAUGHT EXCEPTION");
});
const app = express_1.default();
// Data sanitization agains XSS attacks
// Prevent cross site scripting by replacing html special characters with something else: <script => &lt;script
app.use(xss_clean_1.default());
// Limit requests from same API
const limiter = express_rate_limit_1.default({
    max: 100,
    windowMs: utils_1.toMilliseconds("1 hour"),
    message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);
// Set security HTTP headers
app.use(helmet_1.default());
const server = http_1.default.createServer(app);
// const io = socketio(server);
var io = require("socket.io")(server, { origins: "*:*" });
// Set Routes
// Not using any routes for now..
// app.use("/", baseRoute);
// Use cors to avoid cors error in browser
app.use(cors_1.default());
/*=======================================================*/
/*====================  CONNECTION  =====================*/
/*=======================================================*/
// const adminNamespace = io.of("/admin");
// adminNamespace.on("connection", handleSocket);
io.on("connection", handleSocket);
function handleSocket(socket) {
    socket.on("join", ({ userName, userRole, roomId, roomName }, callback) => {
        // Check is max allowed number of users/rooms hasn't been reached
        if (checkCapacity().max)
            return callback(checkCapacity().payload);
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
            maxCapacity: false,
        };
        // Check is max allowed number of users/rooms hasn't been reached
        if (checkCapacity().max)
            return callback(Object.assign(Object.assign({}, validationMessage), checkCapacity().payload));
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
        if (!isAdmin(socket.id))
            return callback({
                room: null,
                error: "You are not authorized to update categories",
            });
        const result = rooms.updateCategories(args);
        let message = `Categories have been updated::warning`;
        if (args.action === models_1.EAction.updateStatus) {
            if (args.status && args.status === models_1.ERoomStatus.edit) {
                message = `Categories are being edited by the admin::warning`;
            }
            if (args.status && args.status === models_1.ERoomStatus.initial) {
                message = `Categories are done being edited::success`;
            }
        }
        if (result && result.room) {
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
    socket.on("updateCategoryCards", ({ roomId, categoryId, unit, action }, callback) => {
        if (!isAdmin(socket.id))
            return callback({
                room: null,
                error: "You are not authorized to update cards",
            });
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
}
server.listen(PORT, () => console.log("\x1b[45m\x1b[33m\x1b[1m%s\x1b[0m", ` Server running in ${process.env.NODE_ENV} on port ${PORT} `));
function isAdmin(id) {
    const foundUser = users.getUser(id);
    if (!foundUser || foundUser.role !== models_1.EUserRole.admin)
        return false;
    return true;
}
function checkCapacity() {
    const maxCapacityError = "The app has currently reached its max capacity. Please, try again later";
    const isMax = users.users.length >= utils_1.MAX_USERS || rooms.rooms.length >= utils_1.MAX_ROOMS;
    let payload = null;
    if (isMax)
        payload = {
            maxCapacity: true,
            error: maxCapacityError,
        };
    return { max: isMax, payload };
}
// This function will exit node process and shutdown the server
const gracefullyShutdownServer = (serv, err, errorType) => {
    const error = `${errorType}!,${serv ? " gracefully" : ""} shutting down the server. Error: ${err.name}: ${err.message}.`;
    console.log(error);
    console.log(err);
    if (serv) {
        serv.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
/* ERROR EVENT LISTENERS HAVE TO BE AT THE BOTTOM OF THE FILE! */
process.on("unhandledRejection", (err) => {
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
