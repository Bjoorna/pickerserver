import { Schema, model, ObjectId } from 'mongoose';


export interface IGame{
    _id: string,
    hometeam: ObjectId,
    awayteam: ObjectId,
    week: number,
    spread?: string,
    result?: Array<number>
}

const gameSchema = new Schema<IGame>({

    hometeam: {type: Schema.Types.ObjectId, ref: 'Team'},
    awayteam: {type: Schema.Types.ObjectId, ref: 'Team'},
    week: {type: Number, required: true},
    spread: {type: String},
    result:[{type: Number}]
});

export const Game = model<IGame>("Game", gameSchema);