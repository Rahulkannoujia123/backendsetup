import { NextFunction } from "express";
import Joi = require("joi");
import { validate } from "../../helpers/ValidateHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";


class Location {

    async addLocation(req: ReqInterface, res: ResInterface, next: NextFunction) {

        const schema = Joi.object().keys({
            locationName: Joi.string().required(),
            locationType: Joi.string().required(),
            locationAddress: Joi.string().required(),
            locationPhoneNumber: Joi.string().required(),
            locationEmail: Joi.string().email().required(),
            custom1: Joi.string().optional(),
            custom2: Joi.string().optional(),
            geolocation: Joi.object().keys({
                latitude: Joi.string().required(),
                longitude: Joi.string().required()
            }).required(),
        });
        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    };

    async acceptReject(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            locationId: Joi.string().required(),
            status: Joi.number().required(),
        });

        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    }

    async editLocation(req: ReqInterface, res: ResInterface, next: NextFunction) {

        const schema = Joi.object().keys({
            locationId:Joi.string().required(),
            locationName: Joi.string().required(),
            locationType: Joi.string().required(),
            locationAddress: Joi.string().required(),
            locationPhoneNumber: Joi.string().required(),
            locationEmail: Joi.string().email().required(),
            custom1: Joi.string().optional(),
            custom2: Joi.string().optional(),
            geolocation: Joi.object().keys({
                latitude: Joi.string().required(),
                longitude: Joi.string().required()
            }).required(),
        });
        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    };

}

export default new Location();