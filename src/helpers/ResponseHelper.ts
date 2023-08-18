import { ResInterface } from "../interfaces/req.interface"


class ResponseHelper {

    public async responseHandler(res: any, statusCode: number, statusText: string, message: string, data: any) {
        data = await this.execTime(res, statusCode, data);
        res.status(statusCode).json({ status: statusCode, statusText, message: message, data: data })
    }

    public async ok(res: any, message: any, data: any) {
        data = await this.execTime(res, 200, data);
        res.status(200).json({ status: 200, statusText: 'SUCCESS', message: message, data: data })
    }

    public async badRequest(res: any, message: any, data: any = {}) {
        res.status(400).json({ status: 400, statusText: 'BAD_REQUEST', message: message, data: data })
    }

    public async conflict(res: any, message: any, data: any = {}) {
        res.status(409).json({ status: 409, statusText: 'CONFLICT', message: message, data: data })
    }

    public async unAuthenticated(res: any, message: any = null, data: any = {}, statusText?: string) {
        res.status(401).json({ status: 401, statusText: statusText ? statusText : 'UNAUTHORIZE', message: message ? message : "Un-authenticated Request!", data: data })
    }
    public async expired(res: any, message: any = null, data: any = {}) {
        res.status(410).json({ status: 410, statusText: 'EXPIRED', message: message ? message : "Un-authenticated Request!", data: data })
    }

    public async unAuthorize(res: any, message: any = null, data: any = {}) {
        res.status(403).json({ status: 403, statusText: 'FORBIDDEN', message: message ? message : "Un-authenticated Request!", data: data })
    }

    public async serverError(res: any, message: any = null, data: any = {}) {
        res.status(500).json({ status: 500, message: message ? message : "Internal Server Error!", data: data })
    }

    public async created(res: any, message: any = null, data: any = {}) {
        data = await this.execTime(res, 201, data);
        res.status(201).json({ status: 201, statusText: 'CREATED', message: message ? message : "created!", data: data })
    }

    public async forbidden(res: any, message: any = null, data: any = {}) {
        res.status(403).json({ status: 403, statusText: 'FORBIDDEN', message: message ? message : "Un-authenticated Request!", data: data })
    }




    private async execTime(res: ResInterface, status: number, data: any): Promise<any> {
        const execTime = new Date().getTime() - res.startTime;
        if (process.env.NODE_ENV === 'dev') {
            if (data) data.execTime = execTime;
        }
        return data;
    }


}

export default new ResponseHelper();