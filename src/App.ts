/** Initialise API Application and Port */
import express, { Application, NextFunction, Request, Response, Router } from "express";
const app: Application = express();
const port: string = process.env.PORT || '8080';
const NAMESPACE = 'App';

var dotenv = require('dotenv');
dotenv.config();

const Logger = require('./config/Logger');
globalThis.Logger = Logger;

/** Import Authentication Checker */
import { extractJWT } from './middlewares';

/** Import dependecies */
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');

/** Remove X-Powered-By Express and add custom header */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('A-PWNER-MESSAGE', 'VGhpcyBpcyBhIHByaXZhdGUgQVBJClVuYXV0aG9yaXNlZCB1c2Ugd2lsbCBiZSBkZXRlY3RlZCwgYW5kIHdlIHdpbGwgZmluZCB5b3UsIHdhdGNoIG91dC4=')

    /** Log the req */
    globalThis.LoggingParams = { method: req.method, url: req.originalUrl, ip: req.socket.remoteAddress, userId: globalThis.userId }
    Logger.log('info', `[${NAMESPACE}] User connecting to Fonz Server `, { ...globalThis.LoggingParams })
    next();
})
const limiter = rateLimit({
    windowMs: process.env.LIMITER_TIMEOUT_RESET,
    max: process.env.LIMITER_MAX_REQUESTS
});
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

/** Routes */
const IndexRoute: Router = require('./routes/Index.route');
const AuthenticationRoute: Router = require('./routes/Auth.route');
const MusicProviders: Router = require('./routes/MusicProviders.route');
const HostRoute: Router = require('./routes/Host.route');
const GuestRouter: Router = require('./routes/Guest.route');
const CallbackRouter: Router = require('./routes/Callback.route');
const UserRoute: Router = require('./routes/User.route');
const AdminRoute: Router = require('./routes/Admin.route');


/** Requests don't require authentication */
app.use('/', IndexRoute);
app.use('/auth', AuthenticationRoute);
app.use('/callback', CallbackRouter);

/** All requests after this require authentication */
app.use(extractJWT);
app.use('/providers', MusicProviders);
app.use('/user', UserRoute);
app.use('/host', HostRoute);
app.use('/guest', GuestRouter);
app.use('/admin', AdminRoute);
// app.use('/library', libraryRouter);

/** All unknown URL requests managed here */
app.use((req: Request, res: Response) => {
    Logger.log('info', `[${NAMESPACE}] Endpoint not found `, { method: req.method, url: req.originalUrl, ip: req.socket.remoteAddress })
    res.status(404).json({
        status: 404,
        message: "Endpoint not found. Ensure that you have requested the correct URL."
    });
});

try {
    app.listen(port, (): void => {
        Logger.log('info', "[STARTUP] Starting Fonz API Server", {tags: 'startup'})
        console.log(`Fonz API is active at localhost:${port}`);
    });
} catch (error) {
    console.error(`An error occurred with message ${error.message}`);
}