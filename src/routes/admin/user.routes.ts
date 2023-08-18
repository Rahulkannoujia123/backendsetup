// import { Router } from "express";
// import UserController from "../../controllers/admin/user.controller";
// import Authentication from "../../middlewares/authentication.middleware";
// class UserRoutes {
//     public router: Router;

//     constructor() {
//         this.router = Router();
//         this.getRoutes();
//         this.patchRoutes();
//     }

//     getRoutes() {
//         this.router.get(
//             '/list',
//            UserController.list

//         ),
//         this.router.get(
//             '/verified-users',
//             UserController.verifiedUser
//         )
//     }

//     patchRoutes() {
//         this.router.patch(
//             '/change-status/:id',
//             Authentication.admin,
//             UserController.userApprove
        
    
    
//            )
//     }
// }

// export default new UserRoutes().router;