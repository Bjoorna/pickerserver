import { NextFunction, Request, Response, Router } from "express";
import { Mongoose, ObjectId } from "mongoose";
import Controller from "../interfaces/controller.interface";
// import authMiddleware from "../middleware/auth.middleware";
import { Game, IGame } from "../models/game";
import { ITeam } from "../models/team";

class GameController implements Controller{

    public path = "/game";
    public router: Router = Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){

        // add a game
        this.router.post(`${this.path}`, this.addGame);

        // get all games
        this.router.get(`${this.path}`, this.getGames);

        // get game by id
        this.router.get(`${this.path}/:id`, this.getGameByID);
        // edit game
        this.router.put(`${this.path}/:id`, this.updateGame);
        // delete spesific game by id
        this.router.delete(`${this.path}/:id`, this.deleteGameByID);

        // get game by week
        this.router.get(`${this.path}/week/:week`, this.getGamesByWeek); 
        //get game by teamname
        this.router.post(`${this.path}/team`, this.getGamesByTeamName); 
    }

    private getGameByID = async (req: Request, res: Response, next: NextFunction) => {
        const gameID = req.params.id;

        const game = await Game.findById(gameID).populate("hometeam").populate("awayteam").populate("favorite");
        if(game){
            res.json({payload: game});
        }else{
            res.json({error: "Error when finding game"});
        }
    }

    private getGamesByTeamName = async (req: Request, res: Response, next: NextFunction) => {

        // const team = req.params.team;
        const team = req.body;
        // const team = Mongoose.Types.ObjectId(req.params.team);
        const games = await Game.find(
            {$or:[
                {awayteam: team},
                {hometeam: team}
        ]}).populate("hometeam").populate("awayteam").populate("favorite");

        console.log(games);

        res.json({payload: games, message: "Games"});
    }

    private getGamesByWeek = async (req: Request, res: Response, next: NextFunction) => {

        const week = req.params.week;

        const games = await Game.find({"week": +week}).sort({"time": +1}).populate("hometeam").populate("awayteam").populate("favorite");

        if(games){
            res.json({payload: games});
        }else{
            res.json({error: "Some error"});
        }
    }

    private addGame = async (req: Request, res: Response, next: NextFunction) => {

        const gameInfo = req.body;

        const newGame: IGame = await Game.create({
            hometeam: gameInfo.hometeam,
            awayteam: gameInfo.awayteam,
            week: gameInfo.week,
            spread: gameInfo.spread,
            result: gameInfo.result,
            favorite: gameInfo.favorite,
            time: gameInfo.time
        });

        res.json({payload: newGame});
    }

    private updateGame = async (req: Request, res: Response, next: NextFunction) => {

        const gameId = req.params.id;

        const gameUpdates = req.body;
        try{
            const game = await Game.findById(gameId).populate("hometeam").populate("awayteam").populate("favorite");

            if(game){
                game.hometeam = gameUpdates.hometeam;
                game.awayteam = gameUpdates.awayteam;
                game.week = gameUpdates.week;
                game.spread = gameUpdates.spread;
                game.result = gameUpdates.result;
                game.favorite =  gameUpdates.favorite;
                game.time = gameUpdates.time;
    
                const savedGame = await game.save();
    
                if(savedGame){
                    res.json({payload: game, message: "Game updated"});
                }else{
                    res.json({error: "Error during updating of the game"});
                }
            }else{
                res.json({error: "Could not find the game"});
            }
        }catch(e){
            console.log(e);
            res.json({error: e});
        }

    }

    private getGames = async (req: Request, res: Response, next: NextFunction) => {

        const games = await Game.find().populate("hometeam").populate("awayteam").populate("favorite");
        if(games){
            res.json({payload: games});
        }else{
            res.json({error: "Some error"});
        }
    }

    private deleteGameByID = async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params.id;
        const deletedGame = await Game.findByIdAndDelete(id);

        if(deletedGame){
            res.json({message: "Game Deleted"});
        }else{
            res.json({error: "Game Did not exist."});
        }
    }


    
}

export default GameController;