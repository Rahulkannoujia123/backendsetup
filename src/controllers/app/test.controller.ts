import { NextFunction } from "express";
import { MovingItem } from "../../interfaces/item.interface";
import { ReqInterface, ResInterface } from "../../interfaces/req.interface";
import ItemCartModel from "../../models/item-cart.model";
import ItemModel from "../../models/item.model";
import LocationModel from "../../models/location.model";
import MovedItemModel from "../../models/moved-item.model";

class TestController {
    async test(req: ReqInterface, res: ResInterface, next: NextFunction) {
        try {

            const data = await LocationModel.find().lean();

            for (const item of data) {
                await LocationModel.findByIdAndUpdate(item._id, {userId: null});
            }
             return false;
            return res.status(200).json({ ok: 'ok' })
            await MovedItemModel.deleteMany();
            await ItemCartModel.deleteMany();
            await ItemModel.updateMany({}, { movingStatus: MovingItem.assigned });
        } catch (error) {
            next(error);
        }
    }
}

export default new TestController();