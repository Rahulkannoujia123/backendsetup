import { Schema, model, Types } from 'mongoose';

const SessionSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deviceType: {
        type: String,
    },
    deviceToken: {
        type: String,
    },
    deviceId: {
        type: String
    },
    deviceName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

const SessionModel = model('session', SessionSchema);

export default SessionModel;