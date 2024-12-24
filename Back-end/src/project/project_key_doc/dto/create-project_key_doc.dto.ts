import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { KeyDocumentCategory } from "src/enums/role.enum";

export class CreateProjectKeyDocDto {
    @IsNotEmpty()
    @IsString()
    key_doc_title: string;

    @IsNotEmpty()
    @IsString()
    key_doc_url: string;

    @IsNotEmpty()
    @IsEnum(KeyDocumentCategory)
    key_doc_category: KeyDocumentCategory;
}
