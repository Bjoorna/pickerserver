import { Request } from "express";
import { IUser } from "../models/user";

interface IRequestWithUser extends Request{
    user: any
}

export default IRequestWithUser;