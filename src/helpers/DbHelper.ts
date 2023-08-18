import { Types } from 'mongoose';

export const isValidObjetId = (id: string) => {
    if (Types.ObjectId.isValid(id)) { return true }
    return false;
}