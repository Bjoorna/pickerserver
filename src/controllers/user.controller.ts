import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import authMiddleware from "../middleware/auth.middleware";
import {IUser, User} from '../models/user';
import  bcrypt  from 'bcrypt'; 
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { IPrediction, Prediction } from "../models/prediction";


class UserController implements Controller {

    public path = "/user";
    public router = Router();

    public constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get(`${this.path}/:id`, this.getUser);

        this.router.post(`${this.path}/:id/addprediction`, authMiddleware, this.addPrediction);
    }

    private addPrediction = async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.id;
        const predictionInfo = req.body;

        console.log(predictionInfo);

        const newPrediction: IPrediction = await Prediction.create({
            game: predictionInfo.game,
            spreadPrediction: predictionInfo.spreadPrediction,
            predictedResult: predictionInfo.predictedResult
        });

        if(newPrediction){
            const user = await User.findByIdAndUpdate(userId, {$push: {predictions: newPrediction}}, {new: true});

            const updatedPredictons = user.predictions;

            res.json({message: "Prediction Added", payload: updatedPredictons});
        }else{
            res.json({error: "Error when saving prediction"});
        }
    }


    private getUser = async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.id;

        const user: IUser | null = await User.findById(userId);

        if(user){
            user.password = undefined;
            res.json({payload: user});
        }else{
            res.json({error: "Error"});
        }

    }
        

}

export default UserController;