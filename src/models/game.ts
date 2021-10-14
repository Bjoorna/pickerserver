import { Schema, model, ObjectId } from 'mongoose';


export interface IGame{
    _id: string,
    hometeam: ObjectId,
    awayteam: ObjectId,
    week: number,
    spread: number | null
    result: Array<number>,
    favorite: ObjectId | null,
    time?: number
}

const gameSchema = new Schema<IGame>({
    hometeam: {type: Schema.Types.ObjectId, ref: 'Team'},
    awayteam: {type: Schema.Types.ObjectId, ref: 'Team'},
    week: {type: Number, required: true},
    spread: {type: Number, default: null},
    result:[{type: Number, required: true}],
    favorite: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
    time: {type: Number}
});

export const Game = model<IGame>("Game", gameSchema);