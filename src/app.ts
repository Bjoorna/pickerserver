import express from 'express';
import  mongoose from 'mongoose';


class App{
    public app: express.Application;

    constructor(){
        this.app = express();
    }

    public listen(){
        this.app.listen(process.env.PORT || 8080);
    }

    public getServer(){
        return this.app;
    }

    private connectToDB(){

    }
}

export default App;