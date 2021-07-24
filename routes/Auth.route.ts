import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Auth = require('../controller/Auth.controller');

// var SpotifyWebApi = require('spotify-web-api-node');
// const User = require('../controller/host');
// const Spotify = require('../controller/spotify');


router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    Auth.signIn(email, password).then((details) => {
      res.send(details);
    }).catch((error) => {
      res.status(error.status || 500).send(error);
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    Auth.signUp(email, password).then((details) => {
      res.send(details);
    }).catch((error) => {
      res.status(error.status || 500).send(error);
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;