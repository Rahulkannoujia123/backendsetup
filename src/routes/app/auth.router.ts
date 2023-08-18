// import { Router } from "express";
// import AuthController from "../../controllers/app/auth.controller";
// import Authentication from "../../middlewares/authentication.middleware";
// import AuthValidator from "../../validators/app/auth.validator";



// class AuthRoutes {
//     public router: Router;

//     constructor() {
//         this.router = Router();
//         this.postRoutes();
//         this.patchRoutes();
//     }

//     postRoutes() {
//         this.router.post(
//             '/signUp',
//             AuthValidator.signUp,
//             AuthController.SignUp
            
//         );
//         this.router.post(
//             '/verify-otp',
//             AuthController.OtpVerify
        
//         );
//         this.router.post(
//             '/resend-otp',
//             AuthController.ResendOtp
        
//         );
        
//         this.router.post(
//             '/login',
//            // Authentication.user,
//             AuthValidator.login,
//             AuthController.login
        
//         );

//         this.router.post(
//             '/register',
//             Authentication.user,
//             AuthValidator.register,
//             AuthController.Register
        
//         );
//     }

//     patchRoutes() {

//     }
// }

// export default new AuthRoutes().router;