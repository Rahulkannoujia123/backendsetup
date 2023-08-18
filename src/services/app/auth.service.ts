import { NextFunction } from "express";
import { ObjectId } from "mongoose";
import ResponseHelper from "../../helpers/ResponseHelper";

import { ResInterface } from "../../interfaces/req.interface";
import { UserInterface, UserType } from "../../interfaces/user.interface";
import SessionModel from "../../models/session.model";
import UserModel from "../../models/user.model";
import { Auth } from "../../utils/auth";

/**
   * @param phoneNumber {number} phoneNumber of user
   * @param otp {string} otp of user
   * @param next {NextFunction} next function
   * @return {Promise<UserInterface>} new created user
   */
class AuthService {
    async SignUp(
        countryCode: string,
        phoneNumber: string,
        otp: string,
        next: NextFunction
    ): Promise<{ user: UserInterface } | void> {
        try {
            const user = await UserModel.create({
                countryCode,
                phoneNumber,
                otp,

            });
            return { user };

        } catch (error) {
            next(error);
        }
    }
    /**
    * @param name {string} name of user
    * @param otp {string} otp of user
    * @param next {NextFunction} next function
    * @return {Promise<UserInterface>} new created user
    */
    async Register(
        _id: string | ObjectId,
        name: string,
        email: string,
        next: NextFunction
    ): Promise<{ user: UserInterface } | void> {
        try {
            const user = await UserModel.findByIdAndUpdate(
                _id,
                {
                    name,
                    email,
                    userType: UserType.selfRegister,
                    isCompleted: true
                },
                {
                    new: true
                }
            );
            return { user };

        } catch (error) {
            next(error);
        }
    }

    async otpverify(
        otp: string,
        countryCode: string,
        phoneNumber: string,
        deviceType: string,
        res: ResInterface,
        next: NextFunction
    ): Promise<{ user: UserInterface, token: string } | void> {
        try {

            const user = await UserModel.findOne({ countryCode, phoneNumber });
            if (!user) return ResponseHelper.badRequest(res, res.__('invalid_phone_number'));
            if (user.otp !== otp) return ResponseHelper.badRequest(res, res.__('invalid_otp'));
            user.countryCode = countryCode;
            user.phoneNumber = phoneNumber;
            user.otp = null;
            user.isVerified = true;
            const session = await SessionModel.create({
                user: user._id,
                deviceType,
            });
            const payload = {
                id: session._id,
                deviceType,
            }

            const token = await new Auth().getToken(
                payload,
                '365d',
                next
            );
            await user.save();
            return {
                user,
                token
            }
        } catch (error) {
            next(error);
        }
    }
}


export default new AuthService();