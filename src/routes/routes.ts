import { Router } from "express";
//import AuthRoutes from "./admin/auth.routes";

//import UserRoutes from "./admin/user.routes";
//import AuthRouter from "./app/auth.router";

//import userRouter from "./app/user.router";




class Routes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.app();
    this.admin();
  }

  app() {
   // this.router.use('/app/auth', AuthRouter);
   
   // this.router.use('/app/user', userRouter);
 
    

  }

  admin() {
   // this.router.use('/admin/auth', AuthRoutes);
   // this.router.use('/admin/user', UserRoutes);
   


  }

}
export default new Routes().router;