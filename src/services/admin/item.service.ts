import { S3_DIRECTORY } from "../../constants/s3.constant";
import { ItemInterface } from "../../interfaces/item.interface";
import ItemModel from "../../models/item.model";
import { ApiFeatures } from "../../utils/api-features";
import { Auth } from "../../utils/auth";
import { FileUpload } from "../../utils/file.upload";
import QrCode from "../../helpers/QrCode";

class ItemService {
  async add(ItemData: ItemInterface): Promise<{
    item?: ItemInterface
  }> {

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


  /**
   * @param photo {File} photo to be uploaded
   * @param directory {String} photo directory 
   * @returns {Promise<{url: string}>} uploaded photo base path
   */

  // private async uploadPhoto(
  //   photo: any,
  //   directory: string,
  // ): Promise<string> {
  //   const fileName = `${Date.now()}-${photo.originalFilename}`;
  //   return await new FileUpload().uploadFileOnS3(photo, directory, fileName);
  // }
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


  async update(ItemId: string, itemData: ItemInterface, images: any, pdf: any): Promise<ItemInterface> {
    const { itemName, itemOwner,itemOwnerType, ownerName, loanerName, consignmentName, baseLocation, brand, type, custom1, custom2,itemId } = itemData;
    let item = await ItemModel.findById(ItemId);
    item.itemName = itemName,
      item.itemOwner = itemOwner,
      item.itemOwnerType = itemOwnerType,
      item.ownerName = ownerName,
      item.itemId    = itemId,
      item.loanerName = loanerName,
      item.consignmentName = consignmentName,
      item.baseLocation = baseLocation,
      item.brand = brand,
      item.type = type,
      item.custom1 = custom1,
      item.custom2 = custom2,

      item.pdf = pdf
    console.log('photos')
    if (images && typeof images !== 'string') {
      const photos = await this.uploadPhoto(images, S3_DIRECTORY.item);
      item.images.push(...photos)
    }

    if (pdf && typeof pdf !== 'string') {
      item.pdf = await this.uploadPdf(pdf, S3_DIRECTORY.itemPdf);

    }

    await item.save();
    return item;
  }
  
  async list(
    queryString: any
  ): Promise<{ count: number, list: ItemInterface[] }> {
    const countQuery = ItemModel.find({ isDeleted: false });
    const countFeature = new ApiFeatures(countQuery, queryString)
      .searching(['itemName'])
      .getCount();

    const lisQuery = ItemModel.find({ isDeleted: false });
    const listFeature = new ApiFeatures(lisQuery, queryString)
      .searching(['itemName'])
      .sorting('-createdAt')
      .pagination();

    const count = await countFeature.query;
    const list = await listFeature.query.populate("borrowerId", { name: '$name' }).populate('baseLocation');

    return { list, count };
  }
}

export default new ItemService();