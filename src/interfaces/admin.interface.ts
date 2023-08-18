import { Document, ObjectId } from 'mongoose';

export interface AdminInterface extends Document {
    _id: ObjectId | string;
    email: string;
    password: string;
    name: string;
    createdAt:Date;
    updated:Date;
}