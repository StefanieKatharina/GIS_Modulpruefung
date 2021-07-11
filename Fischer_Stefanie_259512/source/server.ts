import express, { Application, Router } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from "cors";
import http from 'http';
import * as mongoHelper from './mongoHelper';

const SERVER_PORT = 5010;
const App: Application = express();
const ApplicationRouter = Router();

export default async function start() {
    App.use(bodyParser.json());
    App.use(express.static("public"));
    App.use(cors());

    mongoHelper.startSession();

    ApplicationRouter.post('/store', async (req, res) => {
        try {
            if (req.body == null) 
                throw new Error('Body was null.');
            if (mongoHelper.isIScore(req.body) == false)
                throw new Error('Body has invalid type.');


            mongoHelper.writeScore(req.body);
            res.send(true);

        } catch (error) {
            let msg = 'Storing score failed.';
            console.error({msg: msg, reason: error});
            res.status(400).send({msg: msg, reason: error});
        }
    });

    ApplicationRouter.get('/highscore', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'highscore.html'));
    });

    ApplicationRouter.get('/scores', async (req, res) => {
        try {
            let scores = await mongoHelper.getScores('asc');            
            res.send(scores);
        } catch (error) {
            let msg = 'Getting scores failed.';
            console.error({msg: msg, reason: error});
            res.status(400).send({msg: msg, reason: error});
        }
    });

    App.use(ApplicationRouter);

    const SERVER = http.createServer(App);

    SERVER.listen(SERVER_PORT, ()=> {
        console.log(`Application Running at port ${SERVER_PORT}`)
    });
}