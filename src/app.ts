import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import AuthController from './controllers/auth.controller';
import TeamController from './controllers/team.controller';


class App{
    public app: express.Application;

    constructor(){
        this.app = express();
        this.connectToDB();
        this.initializeMiddleware();
        this.initControllers();
    }

    initControllers(){
        const authController = new AuthController();
        this.app.use('/', authController.router);

        const teamController = new TeamController();
        this.app.use('/', teamController.router);
    }

    public listen(){
        this.app.listen(process.env.PORT || 8080);
    }

    public getServer(){
        return this.app;
    }

    private initializeMiddleware(){
        this.app.use(express.json());
        this.app.use(cors());
    }

    private connectToDB(){
        const mongodbURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
        mongoose.connect(mongodbURI);
    }
}

export default App;