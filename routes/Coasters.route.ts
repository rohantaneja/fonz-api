import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Coaster = require('../controller/Coasters.controller');

router.get('/', (req: Request, res: Response) => {
    Coaster.getCoasters(res.locals.userId).then((coasters) => {
        res.send(coasters);
    }).catch((error) => {
        res.status(error.status || 500).send(error)
    })
});

router.get('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    Coaster.getCoastersById(res.locals.userId, coasterId).then((coaster) => {
        res.send(coaster);
    }).catch((error) => {
        res.status(error.status || 500).send(error)
    })
});

module.exports = router;