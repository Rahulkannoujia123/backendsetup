import { PipelineStage } from "mongoose";
import { S3_DIRECTORY } from "../../constants/s3.constant";
import { isValidObjetId } from "../../helpers/DbHelper";
import { ItemCartImageType } from "../../interfaces/item-cart.interface";
import { MovingItem } from "../../interfaces/item.interface";
import { MovedItemInterface, MovedItemStatus } from "../../interfaces/moved-item.interface";
import { UserInterface } from "../../interfaces/user.interface";
import ItemCartModel from "../../models/item-cart.model";
import ItemModel from "../../models/item.model";
import MovedItemModel from "../../models/moved-item.model";
import { FileUpload } from "../../utils/file.upload";
import DataDog from "../../utils/logger";

class ItemCartService {
    /**
    * @description get moving items details
    * @param user 
    * @returns moving items
    */
    async movingItemsDetails(
        user: UserInterface
    ): Promise<any> {
        const pipeline = [
            {
                '$match': {
                    'userId': user._id
                }
            }, {
                '$lookup': {
                    'from': 'items',
                    'let': {
                        'itemId': '$itemId'
                    },
                    'as': 'item',
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$eq': [
                                        '$$itemId', '$_id'
                                    ]
                                }
                            }
                        }, {
                            '$lookup': {
                                'from': 'users',
                                'localField': 'borrowerId',
                                'foreignField': '_id',
                                'as': 'borrower'
                            }
                        }, {
                            '$unwind': {
                                'path': '$borrower',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$project': {
                                '_id': 1,
                                'itemName': 1,
                                'itemOwner': 1,
                                'ownerName': 1,
                                'loanerName': 1,
                                'consignmentName': 1,
                                'itemId': 1,
                                'baseLocation': 1,
                                'brand': 1,
                                'type': 1,
                                'images': 1,
                                'isApproved': 1,
                                'borrowerId': 1,
                                'movingStatus': 1,
                                'pdf': 1,
                                'createdAt': 1,
                                'updatedAt': 1,
                                'borrower': {
                                    '_id': 1,
                                    'name': 1
                                }
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    '_id': 1,
                    'itemId': 1,
                    'userId': 1,
                    'images': 1,
                    'item': {
                        '$first': '$item'
                    }
                }
            }
        ] as PipelineStage[];

        return await ItemCartModel.aggregate(pipeline);
    }

    /**
     * @description upload item's image on items added in cart
     * @param items ItemCartImageType 
     * @param user 
     * @returns 
     */
    async uploadMovingCartImages(items: ItemCartImageType, user: UserInterface, logger: DataDog): Promise<
        {
            validationFailed?: boolean,
            success?: boolean,
            isValidObjectId?: boolean
        }
    > {
        const directory = S3_DIRECTORY.itemCart;

        const itemsIds = Object.keys(items);
        let validObjectid = false;
        if (!itemsIds.length) return { validationFailed: true };
        itemsIds.every((id: string) => {
            validObjectid = isValidObjetId(id);
            return validObjectid;
        });
        if (!validObjectid) return { isValidObjectId: true };
        let isValid = true;
        logger.info('check items', { items: Object.keys(items) });
        itemsIds.every((key: string) => {
            if (items[key]) return true;
            isValid = false;
            return false;
        });
        if (!isValid) return { validationFailed: false };
        for (const itemId of itemsIds) {
            const images = await this.uploadPhotos(items[itemId], directory);
            logger.info('images', { images })
            await ItemCartModel.findOneAndUpdate(
                { itemId, userId: user._id, },
                { itemId, userId: user._id, images },
                {
                    upsert: true
                }
            );
            // item.images = images;
            // await item.save();
        }

        await ItemModel.updateMany({ _id: Object.keys(items) }, { movingStatus: MovingItem.addedToMove })
        return { success: true };
    }


    /**
     * @description update a photo on s3 and in a directory
     * @param photo photo should be uploaded
     * @param directory 
     * @returns uploaded image s3 absolute path
     */
    public async uploadPhoto(
        photo: any,
        directory: string,
    ): Promise<string> {
        const fileName = `${Date.now()}-${photo.originalFilename}`;
        return await new FileUpload().uploadFileOnS3(photo, directory, fileName);
    }


    /**
     * @description upload multiple photos on s3
     * @param photos 
     * @param productId 
     * @returns uploaded photos urls array
     */
    public async uploadPhotos(photos: any, directory: string): Promise<string[]> {
        const photosUrl: string[] = [];
        if (Array.isArray(photos)) {
            for (const photo of photos) {
                photosUrl.push(await this.uploadPhoto(photo, directory))
            }
        }
        else if (photos) {
            photosUrl.push(await this.uploadPhoto(photos, directory))
        }
        return photosUrl;
    }


    /**
     * @description end item's moving process and update receiver's images
     * @param itemId 
     * @param images 
     * @returns moved item
     */
    async endProcess(movedItemId: string, images: any[],comment:string): Promise<
        {
            invalidItemId?: boolean,
            movedItem1?: MovedItemInterface
        }
    > {
        const movedItemIds:any =Object.keys(images);
        // console.log(movedItemIds);
        const movedItem1 = await MovedItemModel.findOne({ _id:movedItemId});
        let items = [];
        for(let itemId of movedItemIds){
            let itemobj = movedItem1.item.find(e => JSON.stringify(e._id) === JSON.stringify(itemId));
            console.log("patachale",itemobj);
            const photos = await this.uploadPhotos(images[itemId], S3_DIRECTORY.movedItem);
            itemobj.receivedImages=photos;
            await ItemModel.findByIdAndUpdate(itemId, { movingStatus: MovingItem.assigned,location:movedItem1?.location?._id });
            items.push(itemobj);
        }
        movedItem1.item=items;
        movedItem1.comment =comment;
        movedItem1.movingStatus = MovedItemStatus.completed;
        await movedItem1.save();
        return { movedItem1 };
    }


    async rejectItem(movingId: string,reasonOfRejection:string, images: any[]): Promise<
    {
        movedItem1?: MovedItemInterface
    }
    > {
        const movedItemIds:any =Object.keys(images);
        // console.log(movedItemIds);
        const movedItem1 = await MovedItemModel.findOne({ _id:movingId});
        let items = [];
        for(let itemId of movedItemIds){
            let itemobj = movedItem1.item.find(e => JSON.stringify(e._id) === JSON.stringify(itemId));
            console.log("patachale",itemobj);
            const photos = await this.uploadPhotos(images[itemId], S3_DIRECTORY.movedItem);
            itemobj.rejectedImages=photos;
            await ItemModel.findByIdAndUpdate(itemId, { movingStatus: MovingItem.assigned });
            items.push(itemobj);
        }
        movedItem1.item=items;
        movedItem1.reasonOfRejection=reasonOfRejection;
        movedItem1.movingStatus = MovedItemStatus.rejected;
        await movedItem1.save();
        return { movedItem1 };
    }

    async approveItem(movingId: string,images: any[],userId:string): Promise<
    {
        movedItem1?: MovedItemInterface
    }
    > {
        const movedItemIds:any =Object.keys(images);
        const movedItem1 = await MovedItemModel.findOne({ _id:movingId});
        // console.log(movedItem1);
        let items = [];
        for(let itemId of movedItemIds){
            let itemobj = movedItem1.item.find(e => JSON.stringify(e._id) === JSON.stringify(itemId));
            //  console.log("patachale",itemobj);
            const photos = await this.uploadPhotos(images[itemId], S3_DIRECTORY.movedItem);
            itemobj.rejectedImages=photos;
            await ItemModel.findByIdAndUpdate(itemId, { movingStatus: MovingItem.assigned,borrowerId:userId,location:movedItem1?.location?._id });
            items.push(itemobj);
        }
        movedItem1.item=items;
        movedItem1.movingStatus = MovedItemStatus.approved;
        await movedItem1.save();
        return { movedItem1 };
    }
}

export default new ItemCartService();