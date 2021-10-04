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
        // getuser
        this.router.get(`${this.path}/:id`, this.getUser);

        // edit user
        this.router.put(`${this.path}/:id`, authMiddleware, this.updateUser);


        this.router.get(`${this.path}/predictions/:id`, this.getUserPredictions);
        this.router.put(`${this.path}/predictions/:id`, authMiddleware, this.updatePrediction);
        this.router.post(`${this.path}/predictions/:id`, authMiddleware, this.addPrediction);
    }

    private updateUser = async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.id;
        const newUserData: IUser = req.body;

        const existingUser = await User.findById(userId);

        if(existingUser){
            existingUser.name = newUserData.name;
            existingUser.email = newUserData.email;
            existingUser.isAdmin = newUserData.isAdmin;

            let savedUser = await existingUser.save();

            if(savedUser){
                res.json({message: "User Updated Successfully"});
            }else{
                res.json({error: "Error when saving user."});
            }
            
        }else{
            res.json({error: "Could not find user."});
        }

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
            const user = await User.findByIdAndUpdate(userId, {$push: {predictions: newPrediction}}, {new: true}).populate("predictions");

            user.password = undefined;

            res.json({message: "Prediction Added", payload: user.predictions});
        }else{
            res.json({error: "Error when saving prediction"});
        }
    }

    private updatePrediction = async (req: Request, res: Response, next: NextFunction) => {
        const predictionId = req.params.id;
        const newPrediction: IPrediction = req.body;

        const existingPrediction = await Prediction.findById(predictionId);

        if(existingPrediction){
            existingPrediction.spreadPrediction = newPrediction.spreadPrediction;
            existingPrediction.predictedResult = newPrediction.predictedResult;

            const updatedPrediction = await existingPrediction.save();
            if(updatedPrediction){
                res.json({message: "Prediction Updated", payload: updatedPrediction});
            }else{
                res.json({error: "Error"});
            }
        }else{
            res.json({error: "Error"});
        }

    }


    private getUserPredictions = async (req: Request, res: Response, next: NextFunction) => {
        const userID = req.params.id;

        const user = await User.findById(userID).populate("predictions");

        if(user){
            let predictions = user.predictions;
            console.log(predictions);
            res.json({payload: predictions});
        }else{
            res.json({error: "Error"});
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