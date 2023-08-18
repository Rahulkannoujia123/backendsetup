import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import * as path from 'path';
//import cors from 'cors';
import { env } from './environments/env';
import Routes from './routes/routes';
import { I18n } from 'i18n';
import { ReqInterface, ResInterface } from './interfaces/req.interface';
//import AuthService from './services/admin/auth.service';
import db from './db';
import ErrorHandler from './helpers/ErrorHandler';
import { logger } from './helpers/logger';
//import logger from './utils/logger';



export class Server {
  public app: express.Application = express();

  constructor() {
    console.log('environment', process.env.NODE_ENV);
    this.setConfigurations();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigurations() {
    this.setMongodb();
   // this.enableCors();
    this.configBodyParser();
   // this.setLanguage();
  }



  // setLanguage() {
  //   const localePath = path.resolve(process.cwd() + '/assets/locales');
  //   const i18n = new I18n();
  //   i18n.configure({
  //     locales: ['en', 'fr'],
  //     directory: localePath
  //   })
  //   this.app.use(i18n.init);
  // }


  setMongodb() {
    // mongoose.connect(env().dbUrl, {
    // }).then(() => {
    //   console.log("Database connected");
    //   this.createAdmin();
    // }).catch((e) => {
    //   console.log(e);
    //   console.log('failed');
    // })

     db.connectDb('mongodb+srv://Rahul:myuser@rahul.fack9.mongodb.net/TrayTrackerApp?authSource=admin&replicaSet=atlas-117kuv-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
  }

  async createAdmin() {
   // await AuthService.createAdmin();
  }

  // enableCors() {
  //   this.app.use(
  //     cors({
  //       origin: true,
  //       credentials: true
  //     })
  //   );
  // }

  configBodyParser() {
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(express.json({ limit: '10mb' }));
  }

  setRoutes() {
    this.app.use('/api-doc', express.static(path.resolve(process.cwd() + '/assets/apidoc')))
    // this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use((req: any, res: any, next: express.NextFunction) => {
      res.startTime = new Date().getTime();
      req.startTime = new Date().getTime();
      res.api = req.url;
      res.method = req.method;
      req.deviceType = req.headers.devicetype as string;

      console.log(`Api ==> ${req.url}  ${req.method}`);
      console.log('request-body', req.body);
      next();
    });
    this.app.use('/logs', express.static(path.resolve(process.cwd() + '/logs/combined.log')))
    
   // this.app.use(logger);
    this.app.use('/api/v1', Routes);
  }

  error404Handler() {
    this.app.use((req:any , res: any) => {
      res.status(404).json({
        message: 'Route not found',
        status: 404,

      });
    })
  }

  handleErrors() {
    this.app.use((error: any, req: any, res: any, next: express.NextFunction) => {
      ErrorHandler.globalErrorHandler(error, req, res, next);
    });
  }
}