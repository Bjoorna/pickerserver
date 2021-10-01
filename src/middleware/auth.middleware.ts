import{ NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import IRequestWithUser from '../interfaces/requestwithuser.interface';
import UserToken from '../interfaces/usertoken.interface';
import { IUser, User } from '../models/user';


async function authMiddleware(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers;
    const authToken = authHeader.authorization;
    if(authToken){
        try{
            const tokenIsValid = jwt.verify(authToken, process.env.JWT_SECRET as string);
            const userToken: UserToken = jwt.decode(authToken) as UserToken;
            // const user: IUser | null = await User.findById(userToken.userID);
            // if(user){
            //     console.log(user);
                // request.user = user;
            // }
            next();
        }catch(error){
            next("Invalid Token");
        }

    }else{
        next("Error no token");
    }
}

export default authMiddleware;