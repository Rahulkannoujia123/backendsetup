// import { Router } from "express";
// import AuthController from "../../controllers/admin/auth.controller";
// import Authentication from "../../middlewares/authentication.middleware";
// import AuthValidator from "../../validators/admin/auth.validator";

// class AuthRoutes {
//     public router: Router;

//     constructor() {
//         this.router = Router();
//         this.postRoutes();
//         this.patchRoutes();
//     }

//     postRoutes() {
//         this.router.post(
//             '/login',
//             // AuthValidator.login,
//             AuthController.login

//         );

//         this.router.post(
//             '/change-password',
//             Authentication.admin,
//             AuthValidator.changePassword,
//             AuthController.changePassword
//         );
//         this.router.post(
//             '/approved',
//             Authentication.admin,
//             AuthController.adminApproved
//         )
//         this.router.post(
//             '/forgot-password',
//             AuthController.forgotPassword
//         )
//         this.router.post(
//             '/reset-password',
//             AuthController.resetPassword
//         )
//     }

//     patchRoutes() {
       
//     }
// }

// // export default new AuthRoutes().router;