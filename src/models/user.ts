import { Schema, model, connect, Mongoose, ObjectId } from 'mongoose';

export interface IUser {
    _id: string,
    name: string,
    email: string,
    predictions: Array<ObjectId>,
    isAdmin: boolean,
    friends: Array<ObjectId>,
    password?: string
}

const userSchema = new Schema<IUser>({
    name:{ type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    predictions: [{type: Schema.Types.ObjectId, ref:'Prediction'}],
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    isAdmin: {type: Boolean, default: false}
});

export const User = model<IUser>('User', userSchema);