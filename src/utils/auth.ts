import { ObjectId } from "mongoose";
import * as Bcrypt from "bcrypt";
import { NextFunction } from "express";
import * as Jwt from "jsonwebtoken";
import { env } from "../environments/env";

export class Auth {
    public MAX_TOKEN_TIME = 600000;
    generateVerificationCode(size: number = 5): string {
        let digits = '0123456789';
        let otp = '';
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }

    decodeJwt(token: string): Promise<any> { console.log('token',token)
        return new Promise((resolve, reject) => {
            Jwt.verify(token, process.env.JWT_SECRET, (err: any, data: any) => {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(data);
                }
            })
        });
    }

    /**
     * 
     * @param data 
     * @param expiresIn 
     * @param next 
     * @returns {Promise<string>}
     */
    async getToken(
        data: { [key: string]: string | number | ObjectId },
        expiresIn: string | number,
        next: NextFunction
    ): Promise<string> {
        try {
            return Jwt.sign(
                data,
                env().jwtSecret,
                {
                    expiresIn
                }
            );
        } catch (err) {
            next(err)
        }
    }


    /**
     * 
     * @param candidatePassword 
     * @param userPassword 
     * @returns {Promise<boolean>}
     */
    async comparePassword(candidatePassword: string, userPassword: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(candidatePassword, userPassword, ((err: any, isSame: any) => {
                if (err) {
                    reject(err);
                } else if (!isSame) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }));
        });

    }

    encryptPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err: any, hash: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }

            });

        });
    }


}