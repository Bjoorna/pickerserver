import { Schema, model, ObjectId } from 'mongoose';

export interface IAdminSettings{
    _id: string,
    onWeek: number
}

const adminSchema = new Schema<IAdminSettings>({
    onWeek: {type: Number, default: 1}
});

export const AdminSettings = model<IAdminSettings>("AdminSettings", adminSchema);