import { IsString, IsNumber, IsBoolean } from "class-validator";

export class CreatePetDto {
    /**
     * 이름
     * 성별
     * 중성화 
     * 분류
     * 칩 등록번호 (없으면 -1)
     * 생일
     *  나이
     */
    @IsString()
    name  : string

    @IsString()
    age  : string

    @IsString()
    breed:  string

    @IsString()
    birth  : Date

    @IsNumber()
    gender: string

}
