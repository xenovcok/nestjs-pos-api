import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional() @IsString()
    name?: string;

    @IsOptional() @IsEmail()
    email?: string;

    @IsOptional() @IsString()
    password?: string;

    @IsOptional() @IsIn(['admin', 'kasir', 'owner'])
    role?: 'admin' | 'kasir' | 'owner';
}
