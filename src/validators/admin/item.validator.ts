import { NextFunction } from "express";
import Joi = require("joi");
import { validate } from "../../helpers/ValidateHelper";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";


class Item {
    async addItem(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            itemName: Joi.string().required(),
            itemOwner: Joi.string().required(),
            itemOwnerType: Joi.string().required(),
            ownerName: Joi.string().required(),
            loanerName: Joi.string().required(),
            consignmentName: Joi.string().required(),
            itemId: Joi.string().required(),
            baseLocation: Joi.any().required(),
            brand: Joi.string().required(),
            type: Joi.string().required(),
            custom1: Joi.string().optional(),
            custom2: Joi.string().optional(),
            images: Joi.any().optional(),
            pdf: Joi.any().optional(),
            borrowerId: Joi.string().required()
        });
        console.log(req.body,"add item body")
        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }

    }

    async editItem(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            itemName: Joi.string().required(),
            itemOwnerName: Joi.string().required(),
            itemId: Joi.string().required(),
            baseLocation: Joi.string().required(),
            brand: Joi.string().required(),
            type: Joi.string().required(),
            custom1: Joi.string().optional(),
            custom2: Joi.string().optional(),
            photo: Joi.string().required(),
            pdf: Joi.string().required(),
        });

        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            next();
        }

    }

    async addMovingItem(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            itemId: Joi.string().required()
        });


      

        const isValid = await validate(req.body, res, schema);
        if (isValid) {
            console.log('NEXT ---------------------')
            next();
        }
    }

    async movedItem(req: ReqInterface, res: ResInterface, next: NextFunction) {
        const schema = Joi.object().keys({
            // locationId: Joi.string().required(),
            locationId: Joi.string().when('type', {
                is: 1|2,
                then: Joi.optional()
            }),
            surgonName: Joi.string().required(),
            surgeryDate: Joi.string().required(),
            type:   Joi.number().required().valid(1, 2, 3,4),
            receipt :Joi.string().when('type', {
                is: 2,
                then: Joi.optional()
              }),
            receiverId :Joi.string().when('type', {
                is: 2|3,
                then: Joi.required()
              }),
            shippmentInformation :Joi.string().when('type', {
                is: 2,
                then: Joi.required()
              })
        });

        const isVAlid = await validate(req.body, res, schema);
        if (isVAlid) {
            next();
        }
    }

    async rejectItem(req:ReqInterface,res:ResInterface,next:NextFunction){
        const Schema   = Joi.object().keys({
            movingId  : Joi.string().required(),
            reasonOfRejection : Joi.string().required()

        });

        const isValid =await validate(req.body,res,Schema);
        if(isValid) {
            next();
        }
    }

}
export default new Item();