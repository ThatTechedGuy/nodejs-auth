import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import User from "./entity/User.js";
import middlewares from "./app";

import login from "./controllers/login";
import register from "./controllers/register";
import confirmation from './controllers/confirmation';

const PORT = process.env.PORT || 5000;

(async () => {
  const app = express();

  const connection = await createConnection();

  const db = connection.getRepository(User);

  app.use(middlewares);

  app.listen(PORT, () => console.log("SERVER RUNNING on port:" + PORT));

  app.get("/", (_, res) => res.json({ message: "OK" }));

  app.post("/login", login.handleLogin(db));
  app.post("/register", register.handleRegister(db));
  app.get("/confirmation/:token", confirmation.handleEmailVerification(db));
  app.post("/emailverify", confirmation.sendEmailConfirmation(db));
})();
