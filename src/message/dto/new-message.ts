import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class NewMessageDto {
  @IsNumber()
  @IsNotEmpty({ message: '잘못된 전송' })
  host_id: number;
}
