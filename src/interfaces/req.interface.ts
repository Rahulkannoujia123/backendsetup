import { Request, Response } from 'express';
import DataDog from '../utils/logger';
import { AdminInterface } from './admin.interface';
import { UserInterface } from './user.interface';


export interface ReqInterface extends Request {
    startTime: number;
    admin?: AdminInterface,
    user?: UserInterface;
    files?: any;
    deviceType?: string;
}


/**
 * @interface
 * 
 */
export interface ResInterface extends Response {
    /**
     * @type {(message: string) => string} translation message
     */
    __: (message: string) => string;
    logMsg: string;
    startTime: number;
    api: string;
    method: string;
    logger: DataDog;
}


export interface LogInterface extends Document{
    status: number;
    message: string;
    execTime: number;
    data: any
};



