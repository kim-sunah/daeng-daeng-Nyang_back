import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: '게시물의 제목을 입력해주세요.' })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: '게시물의 내용을 입력해주세요.' })
  readonly content: string;

  // @IsString()
  // @IsNotEmpty({ message: '썸네일 이미지를 등록해주세요.' })
  readonly thumbnail: string;

 

}