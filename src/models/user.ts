import { Schema, model, connect, Mongoose } from 'mongoose';

export interface IUser {
    _id: string,
    name: string,
    email: string,
    isAdmin?: boolean
    password?: string
}

const userSchema = new Schema<IUser>({
    name:{ type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}

});

export const User = model<IUser>('User', userSchema);