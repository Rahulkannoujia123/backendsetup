import { NextFunction } from 'express';
import * as Joi from 'joi';
import { validate } from '../../helpers/ValidateHelper';
import { ReqInterface, ResInterface } from '../../interfaces/req.interface';

class AuthValidator {
    async login(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        });

        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }

    }

    async changePassword(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            password: Joi.string().required(),
            passwordCurrent: Joi.string().required()
        });

        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }

    }
   
}

export default new AuthValidator();