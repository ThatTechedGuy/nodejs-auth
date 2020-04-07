import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { createConnection } from 'typeorm';
import User from './entity/User.js';

import middlewares from './app';

import login from './controllers/login';
import register from './controllers/register';
import confirmation from './controllers/confirmation';

const PORT = process.env.PORT || 5000;

(async () => {

  console.log(__dirname);
  const app = express();

  const connection = await createConnection();

  const db = connection.getRepository(User);


  app.use(middlewares);

  app.listen(PORT, () => console.log('SERVER RUNNING on port:' + PORT));

  app.get('/', (_, res) =>
    res.status(200).json({ success: true, message: 'API Working!!' })
  );
  // Login User Account
  app.post('/user/login', login.handleLogin(db));
  // Register a User
  app.post('/user/register', register.handleRegister(db));
  // Sends email confirmation link
  app.post(
    '/user/sendEmailConfirmation',
    confirmation.sendEmailConfirmation(db)
  );
  // Receives email confirmation through link
  app.get(
    '/user/getEmailConfirmation/:token',
    confirmation.handleEmailVerification(db)
  );
})();
