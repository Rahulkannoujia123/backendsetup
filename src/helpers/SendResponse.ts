import { ReqInterface, ResInterface } from "../interfaces/req.interface";


/**
 * 
 * @param req {ReqInterface} req Object
 * @param res {ResInterface} res Object
 * @param status  {number} response status code
 * @param message {string} status message
 * @param data {any} data object send to response
 */
export const sendResponse = async (
    req: ReqInterface,
    res: ResInterface,
    status: number,
    message: string,
    data: { [key: string]: any } = null
) => {
    const respObj: any = {
        status,
        message: res.__(message),
    }

    const execTime = new Date().getTime() - req.startTime;
    if (process.env.NODE_ENV === 'dev') {
        respObj.execTime = execTime;
    }

    if (data) {
        respObj.data = data;
    }
    res.status(status).json(respObj);
}