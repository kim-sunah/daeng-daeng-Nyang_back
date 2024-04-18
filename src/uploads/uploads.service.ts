import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { basename, extname } from 'path';
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

@Injectable()
export class UploadsService {
  private readonly s3;

  constructor() {
    
   
  }

  private readonly s3Client = new S3Client({region : "ap-northeast-2", credentials:{
    accessKeyId : process.env.AWS_ACCESS_KEY_ID
    , secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
  }})

  async uploadImage(filename : string, file :Buffer) {
    const ext = extname(filename);
    const baseName = basename(filename,ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    console.log(ext)
    console.log(baseName)
    console.log(filenames)

    try{
      await this.s3Client.send(new PutObjectCommand({Bucket : "sunas" , Key : filenames, Body:file}))
      console.log("upload image")
    }
    catch(err){
      console.log("Error")
    }
  }
}