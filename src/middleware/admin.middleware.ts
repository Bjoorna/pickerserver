import{ NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import UserToken from '../interfaces/usertoken.interface';
import { IUser, User } from '../models/user';

async function adminMiddleware(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers;
    const authToken = authHeader.authorization;
    if(authToken){
        try{
            const tokenIsValid = jwt.verify(authToken, process.env.JWT_SECRET as string);
            const userToken: UserToken = jwt.decode(authToken) as UserToken;
            if(userToken){
                console.log(userToken);
                if(userToken.isAdmin){
                    next();
                }else{
                    next("Error User not Admin");
                }
            }
        }catch(error){
            next("Error Invalid Token");
        }
    }else{
        next("Error No Token");
    }
    
}