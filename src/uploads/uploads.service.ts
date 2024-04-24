import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { basename, extname } from 'path';
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
 

  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});


  async uploadImage(filename : string, file :Buffer) {
    const ext = extname(filename);
    const baseName = basename(filename,ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    console.log(ext)
    console.log(baseName)
    console.log(filenames)

    try{
      await this.s3Client.send(new PutObjectCommand({Bucket : "sunah" , Key : filenames, Body:file}))
      console.log("upload image")
    }
    catch(err){
      console.log("Error")
    }
  }
}