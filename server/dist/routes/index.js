"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRoute = void 0;
const express_1 = __importDefault(require("express"));
const baseRoute = express_1.default.Router();
exports.baseRoute = baseRoute;
baseRoute.get("/test", (req, res) => {
    res.send("test");
});
