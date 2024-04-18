import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {
    /**
     * 이름
     * 생일
     * 나이
     * 성별
     * 중성화
     * 분류
     * 칩 등록번호 (없으면 -1)
     */
}
