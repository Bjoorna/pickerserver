import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
// import authMiddleware from "../middleware/auth.middleware";
import {IUser, User} from '../models/user';
import  bcrypt  from 'bcrypt'; 
import jwt, { TokenExpiredError } from 'jsonwebtoken';


class AuthController implements Controller {

    public path = "/auth";
    public router = Router();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){

        this.router.post(`${this.path}/login`, this.loginUser);
        this.router.post(`${this.path}/signup`, this.signupUser);
        this.router.get(`${this.path}/test`, this.test);
        // this.router.get(`${this.path}/testauth`, this.testAuth);
        // this.router.put(`${this.path}/password`, authMiddleware, this.changeUserPassword);
    }

    private test = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req);

        res.json("Hello");
    }

    private loginUser = async (req: Request, res: Response, next: NextFunction) => {

        const email = req.body.email;
        const candpassword = req.body.password;

        const candUser: IUser | null = await User.findOne({email: email});

        if(candUser){
            const isCorrectPassword = await bcrypt.compare(candpassword, candUser.password as string);
            if(isCorrectPassword){
                const token = this.makeToken(candUser);
                res.json({token: token});
            }else{
                res.json({error: "Wrong Credentials"});
            }
        }else{
            res.json({error: "Wrong Credentials"});
        }
    }

    private signupUser = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req);
        const saltRounds = 10;
        const userBody = req.body;
        
        const userExists = await User.findOne({email: userBody.email});
        if(!userExists){
            const hashedpassword = await bcrypt.hash(userBody.password, saltRounds);
            const newUser: IUser = await User.create({
                name: userBody.name,
                email: userBody.email,
                password: hashedpassword,
                height: userBody.height,
                weight: userBody.weight,
                dob: userBody.dob
            });

            const token = this.makeToken(newUser);
            res.json({token: token});

        }else{
            res.json({error: "User with this email already exists"});
        }
    }

    private makeToken(user: IUser) {
        const token = jwt.sign({
            userID: user._id,
            email: user.email},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
            );

        return token;
    }
}

export default AuthController;