import { NextFunction } from 'express';
import * as formidable from 'formidable';
import { ReqInterface, ResInterface } from '../interfaces/req.interface';
class UploadFiles {
  async upload(req: ReqInterface, res: ResInterface, next: NextFunction) {
    try {
      const form = formidable({ multiples: true });
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          next(err);
        }
        else {
          req.files = files;
          req.body = { ...fields };
          next();
        }
      });
    } catch (e) {
      next(e)
    }

  }

}

export default new UploadFiles();