import { NextFunction } from "express";
import ResponseHelper from "../../helpers/ResponseHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";
 import UserModel from "../../models/user.model";
import UserService from "../../services/admin/user.service";


class UserController{
     /**
      * @api {post} /api/app/admin/user/list Get User
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName get-user
      * @apiGroup Admin-User
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *  {
      *   {
      *   "status": 200,
      *   "statusText": "SUCCESS",
      *    "message": "User list fetch successfully",
      *   "data": {
      *   "user": {
      *      "count": 10,
      *      "list": [
      *          {
      *              "_id": "63981945de197586b48899fa",
      *              "name": "sahil",
      *              "email": "sahil123@gmail.com",
      *              "countryCode": "+12",
      *              "phoneNumber": "9125608978",
      *              "userType": 1,
      *              "isApproved": 1,
      *              "isVerified": false,
      *              "isActive": false,
      *              "timestamps": "1670912037664",
      *              "createdAt": "2022-12-13T06:18:45.230Z",
      *              "updatedAt": "2022-12-13T06:18:45.230Z"
      *          },
      *          {
      *              "_id": "639716f997960432c2d36ec1",
      *              "name": "kamal",
      *              "email": "kamal@123gmail.com",
      *              "phoneNumber": "07905222386",
      *              "userType": 1,
      *              "isApproved": 1,
      *              "isVerified": false,
      *              "isActive": false,
      *              "timestamps": "1670837152758",
      *              "createdAt": "2022-12-12T11:56:41.925Z",
      *              "updatedAt": "2022-12-12T11:56:41.925Z"
      *          },
      *          {
      *              "_id": "6396ed03a913302695470d02",
      *              "name": "rakesh",
      *              "email": "rakesh@123gmail.com",
      *              "phoneNumber": "8890503451",
      *              "userType": 1,
      *              "isApproved": 1,
      *              "isVerified": false,
      *              "isActive": false,
      *              "timestamps": "1670826618386",
      *              "createdAt": "2022-12-12T08:57:39.620Z",
      *              "updatedAt": "2022-12-12T08:57:39.620Z"
      *          },
      *          {
      *              "_id": "6396ca1b20fac2bce21c7bf4",
      *              "name": "sahil",
      *              "email": "sahil123@gmail.com",
      *              "phoneNumber": "9125608978",
      *              "userType": 1,
      *              "isApproved": 1,
      *              "isVerified": false,
      *              "isActive": false,
      *              "timestamps": "1670826521321",
      *              "createdAt": "2022-12-12T06:28:43.483Z",
      *              "updatedAt": "2022-12-12T06:28:43.483Z"
      *          }, 
      *      ]
      *    },
      *  "execTime": 69
      *   }
      *   }
      *   **/
    async list(req: ReqInterface, res: ResInterface, next: NextFunction) {
        try {
            const queryString = req.query;
            const user = await UserService.list(queryString);
            res.logMsg = `User list fetched successfully`;
            return ResponseHelper.ok(res, res.__('user_list'), { user });

        } catch (error) {
            next(error)
        }
}

 /**
    * @api {post} /api/v1/admin/user/change-status/id Admin Approve&Reject 
    * @apiHeader {String} App-Version Version Code 1.0.0.
    * @apiVersion 1.0.0
    * @apiName approve&reject
    * @apiGroup Admin-Auth
    * @apiBody {String} isApproved 1
    * @apiSuccessExample {json} Success-Response:
    *  {
    *  "status": 200,
    *  "statusText": "SUCCESS",
    *  "message": "User status changed  successfully",
    *  "data": {
    *    "_id": "6396b154999f28da4213f073",
    *    "countryCode": "+121",
    *    "phoneNumber": "7905222385",
    *    "otp": null,
    *    "isApproved": 1,
    *    "isVerified": true,
    *    "isActive": true,
    *    "timestamps": "1670820172845",
    *    "createdAt": "2022-12-12T04:43:00.126Z",
    *    "updatedAt": "2022-12-12T04:43:00.126Z",
    *    "__v": 0,
    *    "email": "jatin123@gmail.com",
    *    "name": "jatin",
    *    "userType": 2
    *  }
    *   }
    */
async userApprove(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
        let userId = req.params.id;
        const isApproved=req.body.isApproved;
        let user = await UserModel.findOne({
            "_id": userId
        });
        user.isApproved=isApproved;
       await user.save();
        res.logMsg = 'User status changed  successfully';
        return ResponseHelper.ok(res, res.__('user_changed_status'), user);
    } catch (error) {
        next(error)
    }
};

      /**
      * @api {get} /api/app/admin/user/verified-users  Verified-Users
      * @apiHeader {String} App-Version Version Code 1.0.0.
      * @apiVersion 1.0.0
      * @apiName verified-users
      * @apiGroup Admin-User
      * @apiSuccessExample {json} Success-Response:
      * {"status":200,"statusText":"SUCCESS","message":"User list fetch successfully","data":[{"_id":"63930aec81b326b2d1d0e5ff","countryCode":"+121","phoneNumber":"9125618566","otp":"71314","isApproved":1,"isVerified":true,"isActive":false,"timestamps":"1670580939083","createdAt":"2022-12-09T10:16:12.195Z","updatedAt":"2022-12-09T10:16:12.195Z","__v":0,"email":"rohan123@gmail.com","name":"rohan","userType":2,"isCompleted":false},{"_id":"6396b154999f28da4213f073","countryCode":"+121","phoneNumber":"7905222385","otp":null,"isApproved":1,"isVerified":true,"isActive":true,"timestamps":"1670820172845","createdAt":"2022-12-12T04:43:00.126Z","updatedAt":"2022-12-12T04:43:00.126Z","__v":0,"email":"ashish123@gmail.com","name":"ashish","userType":2,"isCompleted":true},{"_id":"63984edf8ce2b15bed1f6a85","countryCode":"+121","phoneNumber":"8917657890","otp":null,"isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1670925991686","createdAt":"2022-12-13T10:07:27.205Z","updatedAt":"2022-12-13T10:07:27.205Z","__v":0},{"_id":"639aa94baa65fea7d8444bf0","countryCode":"+121","phoneNumber":"891765777","otp":null,"isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671080252575","createdAt":"2022-12-15T04:57:47.162Z","updatedAt":"2022-12-15T04:57:47.162Z","__v":0},{"_id":"639aa9ae34ee00b8cfde3f8c","countryCode":"+121","phoneNumber":"891765778","otp":null,"isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671021228032","createdAt":"2022-12-15T04:59:26.921Z","updatedAt":"2022-12-15T04:59:26.922Z","__v":0},{"_id":"639ab74f2160ed41809d7d67","countryCode":"+121","phoneNumber":"6697896541","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671083848839","createdAt":"2022-12-15T05:57:35.258Z","updatedAt":"2022-12-15T05:57:35.258Z","__v":0,"otp":"10219"},{"_id":"639abbc9f731ec47dc21dd33","countryCode":"+91","phoneNumber":"7678283061","isApproved":1,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671084703841","createdAt":"2022-12-15T06:16:41.367Z","updatedAt":"2022-12-15T06:16:41.367Z","__v":0,"otp":null,"email":"ash@gmail.com","name":"Ashish Verma","userType":2},{"_id":"639ac54bf731ec47dc21dd61","countryCode":"+121","phoneNumber":"6697896542","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671084703841","createdAt":"2022-12-15T06:57:15.206Z","updatedAt":"2022-12-15T06:57:15.206Z","__v":0,"otp":null},{"_id":"63a0a56e801ed368b5c4f1c0","countryCode":"+91","phoneNumber":"9315885396","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671470722949","createdAt":"2022-12-19T17:54:54.326Z","updatedAt":"2022-12-19T17:54:54.326Z","__v":0,"otp":null,"email":"makhan@gmail.com","name":"Makahan lal","userType":2},{"_id":"63a0a7a4f0657fbae0ed7286","countryCode":"+91","phoneNumber":"9525887192","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671472842565","createdAt":"2022-12-19T18:04:20.755Z","updatedAt":"2022-12-19T18:04:20.755Z","__v":0,"otp":null,"email":"ganpat@gmail.com","name":"Ganpat","userType":2},{"_id":"63a1a4b9c00b9bcf022c1e9c","countryCode":"+91","phoneNumber":"9414174444","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671536842283","createdAt":"2022-12-20T12:04:09.016Z","updatedAt":"2022-12-20T12:04:09.016Z","__v":0,"otp":null,"email":"as49@mailinator.com","name":"adom smith","userType":2},{"_id":"63a1abb6dbfdd0e888164be9","countryCode":"+91","phoneNumber":"9056487117","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671526973587","createdAt":"2022-12-20T12:33:58.548Z","updatedAt":"2022-12-20T12:33:58.548Z","__v":0,"otp":null,"email":"t11@yopmail.com","name":"Fjgjj677","userType":2},{"_id":"63a29602671ca3edd7bf3cc0","countryCode":"+91","phoneNumber":"8016354629","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671544040821","createdAt":"2022-12-21T05:13:38.972Z","updatedAt":"2022-12-21T05:13:38.972Z","__v":0,"otp":null,"email":"vishwa@hsmd.com","name":"        Udud ","userType":2},{"_id":"63a2e724857cad572544654f","countryCode":"+91","phoneNumber":"6543789123","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-21T10:59:48.280Z","updatedAt":"2022-12-21T10:59:48.280Z","__v":0,"otp":null},{"_id":"63a2e937857cad572544656c","countryCode":"+91","phoneNumber":"4562349874","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-21T11:08:39.741Z","updatedAt":"2022-12-21T11:08:39.741Z","__v":0,"otp":null},{"_id":"63a2ebd2857cad5725446583","countryCode":"+91","phoneNumber":"6548903427","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-21T11:19:46.468Z","updatedAt":"2022-12-21T11:19:46.468Z","__v":0,"otp":null},{"_id":"63a2ed70857cad5725446591","countryCode":"+91","phoneNumber":"5461239872","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-21T11:26:40.424Z","updatedAt":"2022-12-21T11:26:40.424Z","__v":0,"otp":null},{"_id":"63a2edd8857cad5725446599","countryCode":"+91","phoneNumber":"4356123843","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-21T11:28:24.507Z","updatedAt":"2022-12-21T11:28:24.507Z","__v":0,"otp":null},{"_id":"63a4625c857cad57254470ce","countryCode":"+91","phoneNumber":"8881999735","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-22T13:57:48.102Z","updatedAt":"2022-12-22T13:57:48.102Z","__v":0,"otp":null},{"_id":"63a46397857cad57254470d6","countryCode":"+1","phoneNumber":"2703243432","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-22T14:03:03.342Z","updatedAt":"2022-12-22T14:03:03.342Z","__v":0,"otp":null},{"_id":"63a4643f857cad57254470eb","countryCode":"+1","phoneNumber":"2706786786","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1671605115747","createdAt":"2022-12-22T14:05:51.116Z","updatedAt":"2022-12-22T14:05:51.116Z","__v":0,"otp":"18410"},{"_id":"63a585eb707a840f3ac471aa","countryCode":"+91","phoneNumber":"8708923177","isApproved":1,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671787505308","createdAt":"2022-12-23T10:41:47.252Z","updatedAt":"2022-12-23T10:41:47.252Z","__v":0,"otp":null,"email":"ashish@yopmail.com","name":"Ashish","userType":2},{"_id":"63a5935e707a840f3ac473ea","countryCode":"+91","phoneNumber":"8840655242","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671787505308","createdAt":"2022-12-23T11:39:10.151Z","updatedAt":"2022-12-23T11:39:10.151Z","__v":0,"otp":null,"email":"vms@yopmail.com","name":"Vishwa Mohan","userType":2},{"_id":"63a59a47707a840f3ac47460","countryCode":"+91","phoneNumber":"9716785930","isApproved":1,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1671787505308","createdAt":"2022-12-23T12:08:39.759Z","updatedAt":"2022-12-23T12:08:39.759Z","__v":0,"otp":null,"email":"richard@gmail.com","name":"Richard","userType":2},{"_id":"63a95408c7f8b0de3e6e182b","countryCode":"+91","phoneNumber":"9876523164","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672040831687","createdAt":"2022-12-26T07:58:00.030Z","updatedAt":"2022-12-26T07:58:00.030Z","__v":0,"otp":"86182"},{"_id":"63a95a16c7f8b0de3e6e1882","countryCode":"+91","phoneNumber":"8756580423","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672040831687","createdAt":"2022-12-26T08:23:50.273Z","updatedAt":"2022-12-26T08:23:50.273Z","__v":0,"otp":null},{"_id":"63a95ae3c7f8b0de3e6e188d","countryCode":"+91","phoneNumber":"9876123451","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672040831687","createdAt":"2022-12-26T08:27:15.183Z","updatedAt":"2022-12-26T08:27:15.183Z","__v":0,"otp":null},{"_id":"63a95bf6c7f8b0de3e6e189b","countryCode":"+91","phoneNumber":"9875413265","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672040831687","createdAt":"2022-12-26T08:31:50.981Z","updatedAt":"2022-12-26T08:31:50.981Z","__v":0,"otp":null},{"_id":"63a95c28c7f8b0de3e6e18a3","countryCode":"+91","phoneNumber":"9876542316","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672040831687","createdAt":"2022-12-26T08:32:40.976Z","updatedAt":"2022-12-26T08:32:40.976Z","__v":0,"otp":null},{"_id":"63a99851be4035bb67a5551d","countryCode":"+91","phoneNumber":"8052369741","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672056968696","createdAt":"2022-12-26T12:49:21.664Z","updatedAt":"2022-12-26T12:49:21.664Z","__v":0,"otp":null,"email":"t111@yopmail.com","name":"Fyfyddyffufugguguggugg gigigigb.   Fjjffjggi gigigiggiggigiggi","userType":2},{"_id":"63aa84ade6c632127e4da983","countryCode":"+91","phoneNumber":"3452341334","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672118295576","createdAt":"2022-12-27T05:37:49.757Z","updatedAt":"2022-12-27T05:37:49.757Z","__v":0,"otp":"18392"},{"_id":"63aae42e3e28dd8349c493bd","countryCode":"+91","phoneNumber":"8523697412","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672143343359","createdAt":"2022-12-27T12:25:18.647Z","updatedAt":"2022-12-27T12:25:18.647Z","__v":0,"otp":null,"email":"t177@yoomqil.com","name":"Test","userType":2},{"_id":"63aae96a3e28dd8349c49460","countryCode":"+91","phoneNumber":"8523697401","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672143343359","createdAt":"2022-12-27T12:47:38.226Z","updatedAt":"2022-12-27T12:47:38.226Z","__v":0,"otp":null,"email":"sahil@yopmail.com","name":"Sahil","userType":2},{"_id":"63abe176a0542ccd1602b372","countryCode":"+91","phoneNumber":"8523890088","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672158771272","createdAt":"2022-12-28T06:25:58.933Z","updatedAt":"2022-12-28T06:25:58.933Z","__v":0,"otp":null,"email":"t122@yopmail.com","name":"Test","userType":2},{"_id":"63abf1b1a0542ccd1602b900","countryCode":"+91","phoneNumber":"9056852780","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672158771272","createdAt":"2022-12-28T07:35:13.397Z","updatedAt":"2022-12-28T07:35:13.397Z","__v":0,"otp":null,"email":"test112@yopmail.com","name":"Test user","userType":2},{"_id":"63abf2d1a0542ccd1602b950","countryCode":"+91","phoneNumber":"8952369807","isApproved":3,"isCompleted":false,"isVerified":true,"isActive":false,"timestamps":"1672158771272","createdAt":"2022-12-28T07:40:01.193Z","updatedAt":"2022-12-28T07:40:01.193Z","__v":0,"otp":null},{"_id":"63b2ba62fd813cd2e627fd0f","countryCode":"+91","phoneNumber":"8752356886","isApproved":3,"isCompleted":true,"isVerified":true,"isActive":false,"timestamps":"1672387310288","createdAt":"2023-01-02T11:05:06.942Z","updatedAt":"2023-01-02T11:05:06.942Z","__v":0,"otp":null,"email":"test1111@yopmail.com","name":"Testing","userType":2}]}
      *   
      * **/

async verifiedUser(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
        let user = await UserModel.find({
            "isVerified": true,name:{$ne:null}
        });
        return ResponseHelper.ok(res, res.__('user_list'), user);
    } catch (error) {
        next(error)
    }
};

}
export default new UserController();