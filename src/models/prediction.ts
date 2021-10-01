import { Schema, model, ObjectId } from 'mongoose';

export interface IPrediction{
    _id: string,
    game: ObjectId,
    spreadPrediction: number,  // 1-2-3   1=home 2=push 3=away
    predictedResult: Array<number>,
}

const predictionSchema = new Schema<IPrediction>({
    game: {type: Schema.Types.ObjectId, ref: 'Game'},
    spreadPrediction: {type: Number, required: true},
    predictedResult: [{type: Number, default: null}]
});

export const Prediction = model<IPrediction>("Prediction", predictionSchema);