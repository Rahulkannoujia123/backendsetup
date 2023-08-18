import ItemModel from "../../models/item.model";
import { PipelineStage, Types } from 'mongoose';
import MovedItemModel from "../../models/moved-item.model";
import { MovedItemInterface, MovedItemStatus } from "../../interfaces/moved-item.interface";
import { ApiFeatures } from "../../utils/api-features";
import { Approved, ItemInterface } from "../../interfaces/item.interface";
import QrCode from "../../helpers/QrCode";
import { Auth } from "../../utils/auth";
import { FileUpload } from "../../utils/file.upload";
import { S3_DIRECTORY } from "../../constants/s3.constant";


class UserItemService {
  async list(
    borrowerId: any,
    queryString: any,
  ): Promise<{ count: number, list: any[],page:number,limit:number }> {
    const limit = queryString.limit * 1 || 20;
    const page = queryString.page * 1 || 1;
    const skip = (page - 1) * limit;
    
    const match: any = {
      'borrowerId': new Types.ObjectId(borrowerId)
    }
    const search = queryString?.search || "";
    if(search && search.trim()){
      match.itemName = {
          $regex: search,
          $options: "$i"
      }
    }
    // console.log("match => ", match);
    if (queryString.movingStatus && queryString.movingStatus * 1 === 2) {
      return await this.movingItemList(
        skip,
        page,
        limit,
        {
          userId: borrowerId,
          movingStatus: MovedItemStatus.moving
        },
        search
      )
    }

    
    
    if (queryString.movingStatus) match.movingStatus = queryString.movingStatus * 1;
    const pipeline = [
      {
        '$match': match
      },
      {
        '$facet': {
          'count': [
            {
              '$count': 'count'
            }
          ],
          'list': [
            {
              '$skip': skip
            },
            {
              '$limit': limit
            },
            {
              '$lookup': {
                'from': 'users',
                'localField': 'borrowerId',
                'foreignField': '_id',
                'as': 'currentBorrower'
              }
            }, {
              '$unwind': {
                'path': '$currentBorrower',
                'preserveNullAndEmptyArrays': true
              }
            },{
              '$lookup': {
                'from': 'users',
                'localField': 'baseBorrowerId',
                'foreignField': '_id',
                'as': 'baseBorrower'
              }
            }, {
              '$unwind': {
                'path': '$baseBorrower',
                'preserveNullAndEmptyArrays': true
              }
            },{
              '$lookup': {
                'from': 'locations',
                'localField': 'location',
                'foreignField': '_id',
                'as': 'currentLocationData'
              }
            }, {
              '$unwind': {
                'path': '$currentLocationData',
                'preserveNullAndEmptyArrays': true
              }
            },{
              '$lookup': {
                'from': 'locations',
                'localField': 'baseLocation',
                'foreignField': '_id',
                'as': 'baseLocationData'
              }
            }, {
              '$unwind': {
                'path': '$baseLocationData',
                'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$project': {
                '_id': 1,
                'itemName': 1,
                'itemOwner': 1,
                'ownerName': 1,
                'loanerName': 1,
                'consignmentName': 1,
                'itemId': 1,
                'baseLocation': 1,
                'location': 1,
                'brand': 1,
                'type': 1,
                'images': 1,
                'isApproved': 1,
                'borrowerId': 1,
                'baseBorrowerId': 1,
                'movingStatus': 1,
                'pdf': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'custom1': 1,
                'custom2': 1,
                'baseBorrower':1,
                'currentBorrower': {
                  '_id': 1,
                  'name': 1
                },
                'baseLocationData':1,
                'currentLocationData':1
              }
            }
          ]
        }
      },
      {
        '$project': {
          'count': {
            '$first': '$count.count'
          },
          'list': 1
        }
      }
    ] as PipelineStage[];

    let list: any[] = [];
    let count = 0;
    const itemData = await ItemModel.aggregate(pipeline);
   
    if (itemData.length) {
      list = itemData[0].list;
      count = itemData[0].count;
    }
    return { count, list,page,limit };
  }


  private async movingItemList(
    skip: number,
    page: number,
    limit: number,
    match: any,
    search: string = ''
  ): Promise<{ count: number, list: any,page:number ,limit:number}> {
    if(search && search.trim()){
      match['item.itemName'] = {
        '$regex': search.trim(),
        '$options': '$i'
      }
    }
    console.log("match2 =>",match);
    const pipeline = [
      {
        '$match': match
      },
      {
        '$facet': {
          'count': [
            {
              '$count': 'count'
            }
          ],
          'list': [
            {
              '$sort': {
                'createdAt': -1
              }
            },
            {
              '$skip': skip
            },
            {
              '$limit': limit
            },
            {
              '$project': {
                'location': 1,
                'item': 1
              }
            }
          ]
        }
      },
      {
        '$project': {
          'count': {
            '$first': '$count.count'
          },
          'list': 1
        }
      }
    ] as PipelineStage[];

    let list: any[] = [];
    let count = 0;
    const itemData = await MovedItemModel.aggregate(pipeline);
    if (itemData.length) {
      list = itemData[0].list;
      count = itemData[0].count;
    }

    return { list: list.map((e: any) => e = {item:e.item, location: e.location }), count,limit,page }
  }

  async shippingItems(
    queryString:any,
    userId:string,
  ): Promise<{ count: number,list: MovedItemInterface[],page:number,limit:number}> {
    const page = queryString.page * 1 || 1;
    const limit = queryString.limit * 1 || 10;
    const type = queryString.type || 1;
    const movingStatus = queryString.movingStatus || 1;
    const countQuery = MovedItemModel.find({ type:type,userId:userId,movingStatus:movingStatus});
    const countFeature = new ApiFeatures(countQuery, queryString)
        .getCount();

    const lisQuery = MovedItemModel.find({ type:type,userId:userId,movingStatus:movingStatus});
    const listFeature = new ApiFeatures(lisQuery, queryString)
        .fieldsLimiting()
        .pagination();

    const count = await countFeature.query;
    const list = await listFeature.query.populate('receiverId',{ name: '$name' });
    // console.log("fsdfsf", page, limit);
    
    return { count, list ,page,limit };
  }

  async receivingShippedItem(
      receiverId:any,
      queryString:any
  ):Promise<{count: number,list: MovedItemInterface[],page:number,limit:number }>{
    const page  = queryString.page * 1 ||1;
    const limit = queryString.limit * 1 || 10;
    const movingStatus=queryString.movingStatus || 1;
    const countQuery  = MovedItemModel.find({receiverId:receiverId,movingStatus:movingStatus});
    const countFeature =new ApiFeatures(countQuery,queryString)
          .getCount();

    const lisQuery = MovedItemModel.find({receiverId:receiverId,movingStatus:movingStatus});
    const listFeature = new ApiFeatures(lisQuery, queryString)
        .fieldsLimiting()
        .pagination();

    const count = await countFeature.query;
    const list = await listFeature.query.populate('');
    // console.log("fsdfsf", page, limit);
    
    return { count, list ,page,limit };


  }

  async add(ItemData: ItemInterface): Promise<{
    item?: ItemInterface
  }> {
    // console.log('aa gaya dd add');
    const photos = await this.uploadPhotos(ItemData.images, S3_DIRECTORY.item);
    // console.log(photos, 'photos')
    const pdfUrl = await this.uploadPdf(ItemData.pdf, S3_DIRECTORY.itemPdf);
    ItemData.itemId = ItemData.itemId?ItemData.itemId:await this.generateItemId();
   
    // const locationData =await LocationModel.findOne({_id:ItemData.baseLocation});
    const IData: any = {
      itemName: ItemData.itemName,
      itemOwner: ItemData.itemOwner,
      itemOwnerType: ItemData.itemOwnerType,
      ownerName: ItemData.ownerName,
      loanerName: ItemData.loanerName,
      consignmentName: ItemData.consignmentName,
      baseLocation: ItemData.baseLocation,
      location : ItemData.baseLocation,
      brand: ItemData.brand,
      itemId: ItemData.itemId,
      type: ItemData.type,
      custom1: ItemData.custom1,
      custom2: ItemData.custom2,
      images: photos,
      isApproved :Approved.noAction,
      borrowerId: ItemData.borrowerId,
      baseBorrowerId: ItemData.borrowerId,
      pdf: pdfUrl
    }
    // console.log(qqr);
    const item: any = await ItemModel.create(IData) as ItemInterface;
    // const QrImage = await qrCodeGenerate(item);
    // console.log('qwertyuiop', QrImage);
    // const fileName = `${Date.now()}`;
    // const qr = await new FileUpload().uploadBase64OnS3(QrImage, S3_DIRECTORY.qrCode, fileName);
    let qr = await QrCode.qrCodeGenerate(item)
    item.qrcode = qr;
    await item.save();
    return {
      item
    };
  }

  private async uploadPhoto(
    photo: any,
    directory: string,
  ): Promise<string> {
    const fileName = `${Date.now()}-${photo.originalFilename}`;
    return await new FileUpload().uploadFileOnS3(photo, directory, fileName);
  }



  private async uploadPhotos(photos: any, productId: string): Promise<string[]> {
    console.log(photos, "photo");
    const photosUrl: string[] = [];
    if (Array.isArray(photos)) {
      for (const photo of photos) {

        photosUrl.push(await this.uploadPhoto(photo, productId))
      }
    }
    else if (photos) {
      photosUrl.push(await this.uploadPhoto(photos, productId))
    }
    return photosUrl;
  }

  private async uploadPdf(
    pdf: any,
    directory: any
  ): Promise<any> {
    const fileName = `${Date.now()}-${pdf.originalFilename}`;
    return await new FileUpload().uploadPdfOnS3(pdf, directory, fileName);
  }

  private async generateItemId(): Promise<string> {
    let code: string = new Auth().generateVerificationCode(7);
    code = `GT${code}`;
    const isExist = await ItemModel.exists({ itemId: code });
    if (isExist) {
      code = await this.generateItemId()
    }
    return code;
  }

  async getAllItems(
    queryString: any,
  ): Promise<{ count: number, list: any[],page:number,limit:number }> {
    const limit = queryString.limit * 1 || 20;
    const page = queryString.page * 1 || 1;
    let count =0;
    let list =[];
    if(queryString.search){
      const countQuery = ItemModel.find();
      const countFeature = new ApiFeatures(countQuery, queryString)
          .getCount();

      const lisQuery = ItemModel.find();
      const listFeature = new ApiFeatures(lisQuery, queryString)
          .searching(['itemName','itemId'])
          .fieldsLimiting()
          .pagination();

       count = await countFeature.query;
       list = await listFeature.query.populate(['borrowerId','baseBorrowerId','baseLocation','location']);
      // console.log("fsdfsf", page, limit);
    }
    
    return { count, list ,page,limit };
  }

}
export default new UserItemService();