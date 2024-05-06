import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { basename, extname } from 'path';
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
 

  constructor(private readonly configService: ConfigService ,
              @InjectRepository(Post) private postRepository: Repository<Post>,
              @InjectRepository(Upload) private UploadRepository: Repository<Upload>,

  ) {}

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


    try{
      await this.s3Client.send(new PutObjectCommand({Bucket : "sunah" , Key : filenames, Body:file}))
      console.log("upload image")
    }
    catch(err){
      console.log("Error")
    }
  }
}