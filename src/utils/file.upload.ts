import * as fs from 'fs';
import { S3 } from 'aws-sdk';
import { env } from '../environments/env';
// const qr = require('qrcode');


export class FileUpload {
  public s3: S3;
  // static s3: any;

  constructor() {
    this.s3 = new S3({
      accessKeyId: env().awsAccessKey,
      secretAccessKey: env().awsSecretKey,

    });
  }


  

  /**
   * This method is used to upload Qr Code in S3 bucket.
   * @author Ashish
   * @param image 
   * @param path 
   * @returns 
   */
  // static uploadQrCodeInS3(image, path = 'property-image') {

  //   var buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64')

  //   const imageRemoteName = `${path}/image_${new Date().getTime()}.png`;
  //   // console.log('bufferImage1', buf)
  //   // Bucket: env().s3Bucket,
  //   // Body: file_stream,
  //   // ContentType: file.mimetype,
  //   // Key: fileRemoteName,
  //   // ACL: 'public-read'
  //   this.s3.putObject({
  //     Bucket: env().s3Bucket,
  //     Body: buf,
  //     ContentType: 'image/jpeg',
  //     Key: imageRemoteName,
  //     ACL: 'public-read'
  //   })
  //   // return  this.s3.putObject({
  //   //   Bucket: env().s3Bucket,
  //   //   Body: buf,
  //   //   ContentEncoding: 'base64',
  //   //   ContentType: 'image/jpeg',
  //   //   Key: imageRemoteName,
  //   //   ACL: 'public-read'
  //   // })
  //     .promise()
  //     .then(async response => {
  //       console.log('image_uploaded_name', imageRemoteName);
  //       return imageRemoteName;
  //     })
  //     .catch(err => {
  //       console.log('failed:', err)
  //       return null;
  //     })
  // }


  async uploadFileOnS3(
    file: any,
    directory: string,
    fileName: string,
    fileStream?: any
  ): Promise<string> {
    try {
      const file_stream = fileStream ? fileStream : fs.readFileSync(file.filepath)
      const fileRemoteName = `${directory}/${fileName}`;
      return await this.s3.putObject({
        Bucket: env().s3Bucket,
        Body: file_stream,
        ContentType: file.mimetype,
        Key: fileRemoteName,
        ACL: 'public-read'
      }).promise()
        .then(res => {
          console.log(res);
          return fileRemoteName;
        });
    } catch (err) {
      console.log('failed:', err);
      return '';
    }
  }

  async uploadPdfOnS3(
    file: any,
    directory: string,
    fileName: string,
    fileStream?: any
  ): Promise<string> {
    try {
      const file_stream = fileStream ? fileStream : fs.readFileSync(file.filepath)
      const fileRemoteName = `${directory}/${fileName}`;
      return await this.s3.putObject({
        Bucket: env().s3Bucket,
        Body: file_stream,
        ContentType: file.mimetype,
        Key: fileRemoteName,
        ACL: 'public-read'
      }).promise()
        .then(res => {
          console.log(res);
          return fileRemoteName;
        });
    } catch (err) {
      console.log('failed:', err);
      return '';
    }
  }

  async removeFileFromS3(fileRemoteName: string): Promise<boolean> {
    try {

      console.log(fileRemoteName);
      const params = {
        Bucket: env().s3Bucket,
        Key: fileRemoteName
      }
      await this.s3.deleteObject(params);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async copyFilesOnS3(
    copySource: string,
    toDirectory: string
  ) {
    try {
      const params = {
        Bucket: env().s3Bucket,
        CopySource: copySource,
        Key: toDirectory
      }
      const newUrl = await this.s3.copyObject(params);
      return newUrl;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


    async uploadBase64OnS3(
    image: string,
    directory: string,
    fileName: string
  ) {
    try {
      var buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      const fileRemoteName = `${directory}/${fileName}`;
      console.log(fileRemoteName);
      const s3Object = {
        Bucket: env().s3Bucket,
        Body: buf,
        Key: fileRemoteName,
        ContentEncoding: "base64",
        ContentType: 'image/png',
        ACL: 'public-read'
      }

      return await this.s3.putObject(s3Object).promise()
        .then(res => {
          console.log(res);
          return fileRemoteName;
        });

    } catch (error) {
      console.log(error);
      // return '';
    }
  };


  async uploadxlsFileOnS3(
    file: any,
    directory: string,
    fileName: string,
    fileStream?: any
  ): Promise<string> {
    try {
      const file_stream = fileStream ? fileStream : fs.readFileSync(file.filepath)
      const fileRemoteName = `${directory}/${fileName}`;
      return await this.s3.putObject({
        Bucket: env().s3Bucket,
        Body: file_stream,
        ContentType: file.mimetype,
        Key: fileRemoteName,
        ACL: 'public-read'
      }).promise()
        .then(res => {
          console.log(res);
          return fileRemoteName;
        });
    } catch (err) {
      console.log('failed:', err);
      return '';
    }
  }
}

