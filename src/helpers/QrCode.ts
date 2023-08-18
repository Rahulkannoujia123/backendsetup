import * as AWS from 'aws-sdk';
import { env } from '../environments/env';
const qr = require('qrcode');
 
class QrCode {
    static s3 = new AWS.S3({
        accessKeyId: env().awsAccessKey,
        secretAccessKey: env().awsSecretKey
    });

    async qrCodeGenerate(data: any){
        try {
          let qrString = JSON.stringify(data);
          console.log('aaa gaya',qrString);
          let qrCodeReturn = await qr?.toDataURL(qrString)
          if (qrCodeReturn) {
            // console.log('qrCodeReturn', qrCodeReturn)
            const uploadQrCode: any = await QrCode.uploadQrCodeInS3(qrCodeReturn, "qrcode")
            return uploadQrCode;
            //  return qrCodeReturn;
          }
        } catch (e) {
            console.log(e);
            
          console.log('error_newQrCodeGenerate')
        }
      }

      static uploadQrCodeInS3(image:any, path = 'property-image') {
        
        var buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    
        const imageRemoteName = `${path}/image_${new Date().getTime()}.png`;
        // console.log('bufferImage1', buf)
        
        return QrCode.s3.putObject({
            Bucket: env().s3Bucket,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Key: imageRemoteName,
            ACL: 'public-read'
        })
        .promise()
        .then(async response => {
            console.log('image_uploaded_name', imageRemoteName);
            return imageRemoteName;
        })
        .catch(err => {
            console.log('failed:', err)
            return null;
        })
    }
};
export default new QrCode()