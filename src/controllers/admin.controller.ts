import { NextFunction, Request, Response, Router } from "express";
import { Mongoose, ObjectId } from "mongoose";
import Controller from "../interfaces/controller.interface";
import { AdminSettings, IAdminSettings } from "../models/admin";
// import authMiddleware from "../middleware/auth.middleware";

class AdminController implements Controller{

    public path = "/admin";
    public router: Router = Router();

    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){

        // initadmin
        // this.router.get(`${this.path}`, this.initAdminSettings);

        //get current gameweek
        this.router.get(`${this.path}/game/week`, this.getGameWeek);

        // changegameweek
        this.router.put(`${this.path}/game/week`, this.setGameWeek);
    }

    private setGameWeek = async (req: Request, res: Response, next: NextFunction) => {

        const newWeek = req.body.week
        const adminSettings = await AdminSettings.findOne();

        if(adminSettings){
            adminSettings.onWeek = newWeek;
            const savedSettings = await adminSettings.save();
            if(savedSettings){
                res.json({message: "GameWeek updated"});
            }else{
            }
        }else{
            res.json({error: "Could not find the game"});
        }
    }

    private initAdminSettings = async (req: Request, res: Response, next: NextFunction) => {

        const newAdminSettings: IAdminSettings = await AdminSettings.create({
            onWeek: 7
        });

        res.json({message: "Adminsettings created", payload: newAdminSettings});
    }

    private getGameWeek = async (req: Request, res: Response, next: NextFunction) => {
        const adminSettings = await AdminSettings.findOne();
        if(adminSettings){
            res.json({message: "Current Week", payload: adminSettings.onWeek});
        }else{
            res.json({error: "Error"});
        }
    }

}

export default AdminController;