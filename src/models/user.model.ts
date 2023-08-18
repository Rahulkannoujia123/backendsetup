
import { Schema, model } from "mongoose";
import { Approved, UserInterface, UserType } from '../interfaces/user.interface';

const UserSchema = new Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    countryCode: {
        type: String
    },
    phoneNumber: {
        type: String,

    },
    otp: {
        type: String
    },
    userType: {
        type: Number,
        enum: [UserType.addedByAdmin, UserType.selfRegister]
    },
    isApproved: {
        type: Number,
        enum: [Approved.approved, Approved.reject, Approved.noAction],
        default: Approved.noAction,
    },
    isCompleted:{
      type:Boolean,
      default:false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    timestamps: {
        type: String,
        default: Math.round(new Date().getTime()),
    },
}
);

const UserModel = model<UserInterface>("user", UserSchema);
export default UserModel;
