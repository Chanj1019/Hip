import { IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { KeyDocumentCategory } from "src/enums/role.enum";

export class UpdateProjectKeyDocDto {
    @IsOptional()
    @IsString()
    key_doc_title?: string;

    @IsOptional()
    @IsString()
    key_doc_url?: string;

    @IsOptional()
    @IsEnum(KeyDocumentCategory)
    key_doc_category?: KeyDocumentCategory;
}
