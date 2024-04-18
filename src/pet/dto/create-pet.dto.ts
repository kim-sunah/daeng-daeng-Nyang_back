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
    dogNm : string

    @IsString()
    sexNm : string

    @IsString()
    neuterYn : string

    @IsString()
    kindNm : string

    @IsNumber()
    rfidCd : number









}
