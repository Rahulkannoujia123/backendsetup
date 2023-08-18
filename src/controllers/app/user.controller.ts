import { NextFunction } from "express";
import ResponseHelper from "../../helpers/ResponseHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";
import SessionModel from "../../models/session.model";
import userService from "../../services/app/user.service";

class UserController {

    /**
        * @api {get} /api/v1/app/user/logout logout
        * @apiHeader {String} App-Version Version Code 1.0.0.
        * @apiHeader {String} Authorization eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmZlMGNmMTdiYmU2ZjY2NzI3MzlmMyIsImVtYWlsIjoiYWRtaW5Ad2VmdW5kdXMuY29tIiwiaWF..........
        * @apiVersion 1.0.0
        * @apiName logout
        * @apiGroup App-User
        * @apiSuccessExample {json} Success-Response:
        * {
        *        "status": 200,
        *        "statusText": "SUCCESS",
        *        "message": "user_logged_out",
        *        "data": {
        *            "execTime": 143
        *        }
        *    }
        * 
        * */

    async logout(req: ReqInterface, res: ResInterface, next: NextFunction) {
        try {
            const user = req.user;
            await SessionModel.deleteMany({ userId: user._id });
            res.logMsg = `User *${user._id}* logout successfully`;
            return ResponseHelper.ok(res, res.__('user_logged_out'), {});
        } catch (error) {
            next(error);
        }
    }

    /**
        * @api {get} /api/v1/app/user/user-list user-list
        * @apiHeader {String} App-Version Version Code 1.0.0.
        * @apiHeader {String} Authorization eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmZlMGNmMTdiYmU2ZjY2NzI3MzlmMyIsImVtYWlsIjoiYWRtaW5Ad2VmdW5kdXMuY29tIiwiaWF..........
        * @apiVersion 1.0.0
        * @apiName user-list
        * @apiGroup M3-App-User
        * @apiSuccessExample {json} Success-Response:
        * {"status":200,"statusText":"SUCCESS","message":"User list fetch successfully","data":{"data":[{"_id":"6396b154999f28da4213f073","countryCode":"+121","phoneNumber":"7905222385","otp":null,"isApproved":1,"isVerified":true,"isActive":true,"timestamps":"1670820172845","createdAt":"2022-12-12T04:43:00.126Z","updatedAt":"2022-12-12T04:43:00.126Z","__v":0,"email":"ashish123@gmail.com","name":"ashish","userType":2,"isCompleted":true}],"execTime":136}}
        * 
        * */

    async userList(req:ReqInterface,res:ResInterface,next:NextFunction) {
        try{
            const queryString = req.query;
            const data =await userService.userList(queryString);

            return ResponseHelper.ok(res ,res.__('user_list'),{data});

        }catch(error){
            next(error);
        }
    }
}

export default new UserController();