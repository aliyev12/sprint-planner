import express, { Router } from "express";

const baseRoute: Router = express.Router();

baseRoute.get("/test", (req, res) => res.send("test"));

export { baseRoute };
