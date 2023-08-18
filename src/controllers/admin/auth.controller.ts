import { NextFunction } from "express";
import ResponseHelper from "../../helpers/ResponseHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";
import { Approved } from "../../interfaces/user.interface";
import AdminModel from "../../models/admin.model";
import UserModel from "../../models/user.model";
import AuthService from "../../services/admin/auth.service";
import { Auth } from "../../utils/auth";

class AuthController {
  /**
    * @api {post} /api/v1/admin/auth/login Log In
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiVersion 1.0.0
    * @apiName login
    * @apiGroup Admin-Auth
    * @apiBody {String} email Email Id.
    * @apiBody {String} password 
    * @apiSuccessExample {json} Success-Response:
    *    {
    * "status": 200,
    * "statusText": "SUCCESS",
    * "message": "Admin login successfully",
    * "data": {
    *    "admin": {
    *        "_id": "637217547d1d0775c4bf084f",
    *        "email": "admin@traytracker.com",
    *        "name": "Tray&Tracker",
    *        "createdAt": "2022-11-14T10:24:20.711Z",
    *        "updatedAt": "2022-11-15T11:40:01.872Z",
    *        "__v": 0
    *    },
    *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzIxNzU0N2QxZDA3NzVjNGJmMDg0ZiIsImVtYWlsIjoiYWRtaW5AdHJheXRyYWNrZXIuY29tIiwiaWF0IjoxNjY4NTc0NDI3LCJleHAiOjE2Njg2NjA4Mjd9.q8Re91EXeguty6YgsMkDedk-SrOeTLQfPelTo2G7yiM",
    *    "execTime": 111
    *   }
    *  }
    *
    * @apiErrorExample {json} Error-Response:
    * HTTP/1.1 400 Bad Request
    *  {
    *        "status": 400,
    *        "message": "Incorrect email or password"
    *  }
    *
    *
    */
  async login(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const logger = res.logger;

      logger.info('this is error', {email, password})
      const data = await AuthService.login(
        email,
        password,
        res,
        next
      ); 
      if (data) 
        return ResponseHelper.ok(res, res.__('admin_login'), data);
        
    } catch (error) {
      next(error);
    }
  }
/**
      * @api {post} /api/app/admin/change-password Change Password
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName change-password
      * @apiGroup Admin-Auth
      * @apiBody {String} passwordCurrent
      * @apiBody {String} password  
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *     {
      *        "status": 200,
      *        "message": "password changed successfully"
      *     }
      *
      * @apiErrorExample {json} Error-Response:
      * HTTP/1.1 400 Bad Request
      *  {
      *        "status": 400,
      *        "message": "Invalid password"
      *  }
      *
      *
      **/
  async changePassword(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
      const passwordCurrent = req.body.passwordCurrent;
      const password = req.body.password;

      const admin: any = await AdminModel.findById(req.admin._id);

      const isPasswordCurrentCorrect = await new Auth().comparePassword(passwordCurrent, admin.password);

      if (!isPasswordCurrentCorrect) {
        return ResponseHelper.badRequest(res, res.__('incorrect_password'));
      }

      const encryptedPassword = await new Auth().encryptPassword(password);

      admin.password = encryptedPassword;
      await admin.save();

      res.logMsg = `Admin password changed successfully`

      return ResponseHelper.ok(res, res.__('admin_password_changed'), {});
    } catch (err) {
      next(err);
    }
  }
/**
      * @api {post} /api/app/admin/approved Admin Approved
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName admin-approved
      * @apiGroup Admin-Auth
      * @apiBody {String} userId
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *   {
      *  "status": 200,
      *  "statusText": "SUCCESS",
      *  "message": "User approved by admin",
      *  "data": {
      *  "user": {
      *      "_id": "63930dd6dda7a2035d4c280a",
      *      "name": "ashraf",
      *      "email": "ashraf123@gmail.com",
      *      "countryCode": "+12",
      *      "phoneNumber": "9125608537",
      *      "userType": 1,
      *      "isApproved": 1,
      *      "isVerified": false,
      *      "isActive": false,
      *      "timestamps": "1670581712778",
      *      "createdAt": "2022-12-09T10:28:38.585Z",
      *      "updatedAt": "2022-12-09T10:28:38.585Z",
      *      "__v": 0
      *  },
      *  "execTime": 73
      *   }
      *   }
      **
      **/
  async adminApproved(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
         const userId= req.body.userId;
          const user =await UserModel.findOne({_id:userId})
          if(user){
           user.isApproved=Approved.approved
          await user.save();
          return ResponseHelper.ok(res, res.__('user_approved_by_admin'), {user});
          }
    } catch (err) {
      next(err);
    }
  }
  /**
      * @api {post} /api/app/admin/forgot-password Forgot Password
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName forgot-password
      * @apiGroup Admin-Auth
      * @apiBody {String} email admin@traytracker.com
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *     {
      *   "status": 200,
      *   "statusText": "SUCCESS",
      *  "message": "Reset password sent link successfully",
      *   "data": {
      *  "endPoint": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzIxNzU0N2QxZDA3NzVjNGJmMDg0ZiIsInJvbGUiOiJGT1JHT1RfUEFTU1dPUkQiLCJpYXQiOjE2NzA5MTQ4MzgsImV4cCI6MTY3MDkxODQzOH0.vG_L7KW9_TT8KllOfQGW21N9IFqiQTtkWUqmrElONVA",
      *  "execTime": 41
      *  }
      *  }
      *
      *
      **/
  async forgotPassword(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
        const email = req.body.email;
        const endPoint = await AuthService.forgotPassword(
            email,
            req,
            res,
            next
        );

        if (endPoint)
            return ResponseHelper.ok(res, res.__('reset_password_link'), { endPoint });
    } catch (error) {
        next(error);
    }
}
/**
      * @api {post} /api/app/admin/reset-password Reset Password
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName reset-password
      * @apiGroup Admin-Auth
      * @apiBody {String} password 
      *@apiBody {String} token
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *   {
      *   "status": 200,
      *   "statusText": "SUCCESS",
      *   "message": "Reset password successfully",
      *   "data": {
      *   "admin": {
      *      "_id": "637217547d1d0775c4bf084f",
      *      "email": "admin@traytracker.com",
      *      "name": "Tray&Tracker",
      *      "createdAt": "2022-11-14T10:24:20.711Z",
      *      "updatedAt": "2022-12-13T07:04:16.865Z",
      *      "__v": 0
      *  },
      *  "execTime": 143
      *   }
      *  }
      *
      **/
async resetPassword(req: ReqInterface, res: ResInterface, next: NextFunction) {
  try {
      const password = req.body.password;
      const resetToken = req.body.resetToken;
      const data = await AuthService.resetPassword(password, resetToken, res, next);
      if (data) {
          res.logMsg = 'Reset password successfully'
          return ResponseHelper.ok(res, res.__('password_reset_done'), data);
      }
  } catch (error) {
      next(error);
  }
}
    }  
export default new AuthController();