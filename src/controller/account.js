import  mongoose from 'mongoose';
import { Router } from 'express';
import Account from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

  // '/v1/account'
  api.get('/', (req, res) => {
    res.status(200).send({ user: req.user });
  });


  /**
   * @api {POST} /account/register  POST New User
   * @apiVersion 0.1.0
   * @apiParam {String} email User email.
   * @apiParam  {String} password User password.
   * @apiParamExample {json} Request-Example:
   *
   *  {
   *    "email": "john@api.com",
   *    "password": "12345678"
   *  }
   *
   * @apiGroup User
   */
  api.post('/register', (req, res) => {
    Account.register(new Account({ username: req.body.email}), req.body.password, function(err, account) {
      if (err) {
        return res.status(500).send('An error occurred: ' + err);
      }

      passport.authenticate(
        'local', {
          session: false
      })(req, res, () => {
        res.status(200).send('Successfully created new account');
      });
    });
  });

  /**
   * @api {POST} /account/login  POST Login/Get Token
   * @apiParam {String} title Foodtruck Review Title.
   * @apiParam  {String} text Foodtruck Review Text.
   * @apiParamExample {json} Request-Example:
   *
   *  {
   *    "email": "john@api.com",
   *    "password": "12345678"
   *  }
   *
   * @apiGroup User
   */
  api.post('/login', passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateAccessToken, respond);

  /**
   * @api {POST} /account/logout  POST User Logout
   * @apiGroup User
   */
  api.get('/logout', authenticate, (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
  });

  /**
   * @api {GET} /account/me  GET User/Your Info
   * @apiGroup User
   * @apiHeader {String} Authorization Users unique access-token example 'Bearer {token}'.
   */
  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });

  return api;
}
