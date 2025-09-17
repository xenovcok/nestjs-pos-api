import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    name?: string;

    @IsNumber()
    price?: number;

    @IsNumber()
    stock?: number;

    @IsString()
    type?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}