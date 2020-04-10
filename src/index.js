import 'core-js';
import 'regenerator-runtime';


import 'reflect-metadata';

import dotenv from 'dotenv';
import express from 'express';

import { createConnection } from 'typeorm';
import User from './entity/User.js';

import middlewares from './app';

import login from './controllers/login';
import register from './controllers/register';
import confirmation from './controllers/confirmation';
import redis from './services/store.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  const app = express();

  /* Connecting to DB */
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
  // Receives email confirmation through OTP
  app.post(
    '/user/getEmailConfirmation',
    confirmation.handleEmailVerification(db)
  );

  app.post('/user/sendPasswordReset', confirmation.sendResetPasswordLink(db));

  app.post('/user/getPasswordReset', confirmation.handlePasswordReset(db));

  /* Test */
  app.get('/users', async (_, res) => {
    const users = await db.find();
    res.json({ users: users });
  });

  app.get('/clear', async (_, res) => {
    await db.clear();
    redis.keys('*').then(function (keys) {
      // Using pipeline instead of sending
      // one command each time to improve the
      // performance.
      var pipeline = redis.pipeline();
      keys.forEach(function (key) {
        pipeline.del(key);
      });
      return pipeline.exec();
    });
    const users = await db.find();
    res.json(users);
  });
})();
