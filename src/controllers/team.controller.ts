import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import {ITeam, Team} from '../models/team';


class TeamController implements Controller{

    public path = "/team";
    public router = Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){

        // getbyid
        this.router.get(`${this.path}/:id`, this.getTeam);
        // get all teams
        this.router.get(`${this.path}`, this.getTeams);
        // add team
        this.router.post(`${this.path}`, this.addTeam);
        // edit team
        this.router.put(`${this.path}/:id`, this.editTeam);
    }


    private addTeam = async (req: Request, res: Response, next: NextFunction) => {

        console.log(req.body);
        const teamData = req.body;

        const teamExists = await Team.findOne({name: teamData.name});

        if(!teamExists){
            const newTeam: ITeam = await Team.create({
                name: teamData.name,
                abbreviation: teamData.abbreviation,
                imageurl: teamData.imageurl
            });

            res.json({payload: newTeam});
        }else{
            res.json({error: "Team Already Exists"});
        }
    }

    private getTeam = async (req: Request, res: Response, next: NextFunction) => {

        const teamID = req.params.id;
        const team = await Team.findById(teamID);
        if(team){
            res.json({payload: team});
        }else{
            res.json({error: "Error, dit not find team"});
        }
    }


    private getTeams = async (req: Request, res: Response, next: NextFunction) => {
        const teams = await Team.find().sort({"name": 1});
        if(teams){
            res.json({payload: teams});
        }else{
            res.json({error: "Some error"});
        }
    }

    private editTeam = async (req: Request, res: Response, next: NextFunction) => {
        const teamId = req.params.id;
        const newTeamInfo = req.body;

        const existingTeam = await Team.findById(teamId);

        if(existingTeam){
            existingTeam.name = newTeamInfo.name,
            existingTeam.abbreviation = newTeamInfo.abbreviation,
            existingTeam.imageurl = newTeamInfo.imageurl

            const updatedTeam = await existingTeam.save();
            if(updatedTeam){
                res.json({message: "Team Updated Successfully"});
            }else{
                res.json({error: "Some error"});
            }
        }else{
            res.json({error:"Could not find that team"});
        }
    }
}

export default TeamController;