import { Schema, model } from 'mongoose';

export interface ITeam{
    _id: string,
    name: string,
    abbreviation: string,
    imageurl: string,
    record: Array<number>
}

const teamSchema = new Schema<ITeam>({
    name:{ type: String, required: true},
    abbreviation:{ type: String, required: true},
    imageurl:{ type: String, required: true},
    record: [{type: Number}]
});

export const Team = model<ITeam>("Team", teamSchema);