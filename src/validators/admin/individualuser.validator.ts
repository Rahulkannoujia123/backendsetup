import { NextFunction } from "express";
import Joi = require("joi");
import { validate } from "../../helpers/ValidateHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";


class IndividualUser{
 async addindividualUser(req: ReqInterface, res: ResInterface, next: NextFunction) {
    const schema = Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required(),
        countryCode:Joi.string().optional(),
        phoneNumber:Joi.string().required()
    });

    const isValid = await validate(req.body, res, schema);
    if (isValid) {
        next();
    }

}

async editindividualUser(req: ReqInterface, res: ResInterface, next: NextFunction) {
    const schema = Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required(),
        countryCode:Joi.number().optional(),
        phoneNumber:Joi.number().required()
    });

    const isValid = await validate(req.body, res, schema);
    if (isValid) {
        next();
    }

}
}
export default new IndividualUser();