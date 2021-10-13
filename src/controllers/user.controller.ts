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

        // get all users
        this.router.get(`${this.path}`, this.getUsers);

        // finduser by name
        this.router.post(`${this.path}/find`, this.findUserByName);

        // edit user
        this.router.put(`${this.path}/:id`, authMiddleware, this.updateUser);

        // add friend
        this.router.post(`${this.path}/addfriend`, authMiddleware, this.addFriend);

        // get friendlist
        this.router.get(`${this.path}/:id/friends`, authMiddleware, this.getFriends);

        this.router.get(`${this.path}/predictions/:id`, this.getUserPredictions);
        this.router.put(`${this.path}/predictions/:id`, authMiddleware, this.updatePrediction);
        this.router.post(`${this.path}/predictions/:id`, authMiddleware, this.addPrediction);
        this.router.delete(`${this.path}/predictions/:id`, authMiddleware, this.deletePrediction);
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

    private getUsers = async (req: Request, res: Response, next: NextFunction) => {

        const users = await User.find().select("-password");
        if(users){
            res.json({payload: users});
        }else{
            res.json({error: "Error when finding users"});

        }
    }

    private deletePrediction = async (req: Request, res: Response, next: NextFunction) => {

        const predictionId = req.params.id;

        const deletePred = await Prediction.findByIdAndDelete(predictionId);
        if(deletePred){
            res.json({message: "Prediction deleted", payload: deletePred});
        }else{
            res.json({error: "Error when removing prediction"});
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

    private addFriend = async (req: Request, res: Response, next: NextFunction) => {

        const friendID = req.body.friendID;
        const userID = req.body.userID;

        const user = await User.findByIdAndUpdate(userID, {$push: {friends: friendID}});
        console.log(user);

        if(user){
            res.json({message: "Friend Added"});
        }else{
            res.json({error: "Error when adding friend"});
        }
    }

    private getFriends = async (req: Request, res: Response, next: NextFunction) => {
        const userID = req.params.id;
        const user = await User.findById(userID);

        if(user){
            
            const getFriends =  await Promise.all(
                user.friends.map(friend => User.findById(friend).select("-password -friends -email -isAdmin")
            ));

            console.log(getFriends);
    
            res.json({payload: getFriends, message: "Friends"});
        }else{
            res.json({error: "Error when getting friends."})
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

    private findUserByName = async (req: Request, res: Response, next: NextFunction) => {

        const nameSearch = req.body.name;

        const query = new RegExp(nameSearch, 'i');
        try{
            const names = await User.find({name: {$regex: query}}).select("-password -email -predictions -isAdmin");
            if(names){
                res.json({payload: names});
            }else{
                res.json({message: "Could not find with that name"});
            }
        }catch(e){
            res.json({error: e});
        }
        
    }
        

}

export default UserController;